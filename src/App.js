import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
  const [isValidApprover, setIsValidApprover] = React.useState();

  const [missions, setMissions] = React.useState([{id: 1, approval1: false, approval2: true},
    {id: 2, approval1: true, approval2: true}]);

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)


  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  const approveMission = (missionId) => {
    // TODO:
    // Call contract and refresh missions list
  }

  React.useEffect(
    () => {
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {

        setIsValidApprover(false);

        // TODO: once contract ready
        // window.contract.isValidApprover({ accountId: window.accountId })
        //   .then(isValidApprover => {
        //     setIsValidApprover(isValidApprover)
        //   })
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  )

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Rocket Approval 🚀</h1>
        <p>
          Only valid approvers can approve a rocket before launch.
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  return (
    <>
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          Logged as {window.accountId}:
        </h1>
        <p>
          Only 2 eligible users can approve new space missions. If you are not an eligible user,
          you can still create a new space mission which will need to be approved by the eligible approvers.
        </p>
        <p>
          Your roles:
        </p>
            <ul>
              <li>✅ You can create mission</li>
              <li>{isValidApprover ? '✅ Can approve missions ' : `❌ You can't approve missions`}</li>
            </ul>
        <form onSubmit={async event => {
          event.preventDefault()

          // disable the form while the value gets updated on-chain
          fieldset.disabled = true

          try {
            // make an update call to the smart contract
            // TODO:
            // await window.contract.authoriseMission({
            //   // pass the value that the user entered in the greeting field
            //   missionId: 5
            // })
          } catch (e) {
            alert(
              'Something went wrong! ' +
              'Maybe you need to sign out and back in? ' +
              'Check your browser console for more info.'
            )
            throw e
          } finally {
            // re-enable the form, whether the call succeeded or failed
            fieldset.disabled = false
          }

          // show Notification
          setShowNotification(true)

          // remove Notification again after css animation completes
          // this allows it to be shown again next time the form is submitted
          setTimeout(() => {
            setShowNotification(false)
          }, 11000)
        }}>
          <fieldset id="fieldset">
            <label
              htmlFor="greeting"
              style={{
                display: 'block',
                color: 'var(--gray)',
                marginBottom: '0.5em'
              }}
            >
              Create new mission
            </label>
            <div style={{ display: 'flex' }}>
              <input
                autoComplete="off"
                placeholder="Mission name"
                id="greeting"
                onChange={e => setButtonDisabled(false)}
                style={{ flex: 1 }}
              />
              <button
                disabled={buttonDisabled}
                style={{ borderRadius: '0 5px 5px 0' }}
              >
                Create
              </button>
            </div>
          </fieldset>
        </form>
        <p>
          Available missions:
        </p>
          {missions.map((mission) => (
            <div key={mission.id}>
              <h5>ID: {mission.id}</h5>
              <p>Approval 1: {mission.approval1 ? '✅' : '❌'}</p>
              <p>Approval 2: {mission.approval2 ? '✅' : '❌'}</p>
              {(mission.approval1 && mission.approval2) ? <strong>Ready for launch 🚀</strong> : (isValidApprover && <button onClick={() => {approveMission(mission.id)}} >Approve</button>)}
            </div>
          ))}
      </main>
      {showNotification && <Notification />}
    </>
  )
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <aside>
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
        {window.accountId}
      </a>
      {' '/* React trims whitespace around tags; insert literal space character when needed */}
      called method: 'setGreeting' in contract:
      {' '}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}
