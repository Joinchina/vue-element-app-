import storage from '@/utils/storage'
export function getToken(){
	let token = "";
	if(storage.has("auth")){
		token = storage.get("auth");
	}
	return token;
	
}