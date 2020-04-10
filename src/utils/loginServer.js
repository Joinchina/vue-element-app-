import storage from './storage';
import { Base64 } from 'js-base64';

const decodeToken = () =>{
	 let deCodeArray = {};
	 let token_json = storage.get("token_users");
	 for(var i in token_json){
	      let item = token_json[i].split(".")[1];
	      let itemDecode = JSON.parse(Base64.decode(item));
	      deCodeArray[itemDecode["userName"]] = itemDecode;
	  };
	  
  	return deCodeArray;
}

const curName = () =>{
	let name = "";
	let curUserName = storage.get("cur_username");
	if(!!curUserName){
		name = decodeToken()[curUserName]["name"];
	    return name;
	}
	
}

const curId = (type) =>{
	 let curId = "";
	 let token_json = decodeToken();
	 let curUserName = storage.get("cur_username");
	 if(type == "clazzId"){
	 	 curId = decodeToken()[curUserName]["clazzId"];
	 }else{
	 	 curId = decodeToken()[curUserName]["sub"];
	 }
	
	 return curId;
}

const curUserId = () =>{
	let curUserId = "";
	let token_json = decodeToken();
	let curUserName = storage.get("cur_username");
	curUserId = decodeToken()[curUserName]["sub"];
	return curUserId;
}

const curTelId = (type) =>{
	 let clazzId = "";
	 let curUserName = "";
	 let token_json = decodeToken();
	 for(var i in token_json){
	 	curUserName = i;
	 }
	 if(type == "clazzId"){

	 	   clazzId = decodeToken()[curUserName]["clazzId"];

	 }else{

	 	   clazzId = decodeToken()[curUserName]["sub"];

	 }
	
	 return clazzId;
}


const curTelUername = () =>{
	 let curUserName = "";
	 let token_json = decodeToken();
	 for(var i in token_json){
	 	curUserName = i;
	 }
	 return curUserName;
}


const curGetToken = () =>{

	let curToken = '';
	let token_json = storage.get("token_users");
	let decodeToken_json = decodeToken();

	//获取当前的用户id
	let curName = storage.get("cur_username");
	
	let curUserId = decodeToken_json[curName]["sub"];
	curToken = token_json[curUserId];

	//当前账号
	// let item = curToken.split(".")[1];
	// let itemDecode = JSON.parse(Base64.decode(item));
	// console.log(itemDecode);
	return curToken;

}

const curLastToken = () =>{
	let lastToken = '';
	let token_json = storage.get("token_users");
	for(var i in token_json){
		lastToken = token_json[i];
	}

	//当前账号的token
	let item = lastToken.split(".")[1];
	let itemDecode = JSON.parse(Base64.decode(item));

	return lastToken;
}

const userIds = () =>{
	let userIds = "";
	let userArray = [];
	let token_json = decodeToken();
	for(var i in token_json){
		let users = token_json[i]["sub"]
		userArray.push(users);	
	}
	if(userArray.length > 0){
		userArray.forEach((user,index)=>{
			if(index == 0){
				userIds += "userIds=" + user;
			}else{
				userIds += "&userIds=" + user;
			}
		})
	}
	return userIds;
}

const onlyOneClass = () =>{
	let num = 0;
	let token_json = storage.get("token_users");
	for(var i in token_json){
		num++;
	}
	if(num == 1){
		return num = 1;
	}else if(num > 1){
		return num = 2;
	}else{
		return num;
	}

}

const userObj = {
	//解析账号token
	detoken:decodeToken,

	//账号 -- 获取当前姓名
	curname:curName,

	//账号 -- 获取当前id clazzId or userId
	curId:curId,

	//账号 -- 当前token
	curGetToken:curGetToken,

	//账号 -- 当前userId
	curUserId:curUserId,

	//手机号 -- 获取当前Id clazzId or userId
	curTelId:curTelId,


	//手机号 -- 存储当前账号
	curTelUername:curTelUername,

	//手机号 -- 存储用户最后一个token
	curLastToken:curLastToken,

	//获取所有的userIds
	userIds:userIds,

	//是否为1个班级
	onlyOneClass:onlyOneClass,

	


}

export default userObj;