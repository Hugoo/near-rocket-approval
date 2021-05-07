import { PersistentMap, PersistentVector, u128, PersistentSet, storage, base58, env, Context, logging } from "near-sdk-as";

let validApproverSet=new PersistentSet<string>('approvers')
validApproverSet.add('axle.testnet')
validApproverSet.add('fdsfds.testnet');

let missionApprovalMap = new PersistentMap<string, bool>("missionApprovals");

export function isValidApprover():bool{
    logging.log(Context.sender);
    return validApproverSet.has(Context.sender)
}

export function authorizeMission(missionInt:i32, authorizedValue:bool=true):bool{
    let key = Context.sender+missionInt.toString();
    missionApprovalMap.set(key, authorizedValue);
    logging.log(missionApprovalMap);
    return missionApprovalMap.getSome(key);
}

export function isMissionAuthorized(missionInt:i32):bool{
    let returnValue=true;
    validApproverSet.values().forEach((approverString: string) => {
        logging.log(approverString);
        // let key = approverString+missionInt.toString();
        // let isApproved=missionApprovalMap.get(key);
        // if(!=true){
        //     returnValue=false;
        // }
    });
    return returnValue;
}