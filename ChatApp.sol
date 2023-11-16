//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


contract ChatApp{

    struct user{
        string name;
        friend[] friendList;
    }

    struct friend{
        string name;
        address pubkey;
    }

    struct message{
        address sender;
        uint256 timestamp;
        string msg;
    }

    struct AllUserStruct{
        string name;
        address accountAddress;
    }

    AllUserStruct[] getAllUsers;

    mapping(address => user) userList;
    mapping(bytes32 => message[]) allMessages;

    function checkUserExists(address pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length > 0;
    }

    function createAccount(string calldata name) external{
        require(checkUserExists(msg.sender) == false, "User already exists");
        require(bytes(name).length > 0, "Username can't be mepty");
        userList[msg.sender].name = name;
        getAllUsers.push(AllUserStruct(name, msg.sender));
    }

    function getUsername(address pubkey) external view returns(string memory){
        require(checkUserExists(pubkey), "User doesn't exist");
        return userList[pubkey].name;
    }

    function addFriend(address friend_key, string calldata name) external{
        require(checkUserExists(msg.sender), "Login before adding friend");
        require(checkUserExists(friend_key), "Such user doesn't exist");
        require(msg.sender != friend_key, "Can not add yourself to friends");
        require(checkAlreadyFriends(msg.sender, friend_key) == false, "Already friends");
        _addFriend(msg.sender, friend_key, name);
        _addFriend(friend_key, msg.sender, userList[msg.sender].name);
    }

    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns(bool){
        for(uint256 i = 0; i < userList[pubkey1].friendList.length; i++){
            if(userList[pubkey1].friendList[i].pubkey == pubkey2)return true;
        }
        return false;
    }
    

    function _addFriend(address me, address friend_key, string memory name) internal{
        friend memory newFriend = friend(name, friend_key);
        userList[me].friendList.push(newFriend);
    }
    
    function getFriends() external view returns(friend[] memory){
        return userList[msg.sender].friendList;
    }

    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
        if(pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        }else return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    function sendMessage(address friend_key, string calldata _msg) external {
        require(checkUserExists(msg.sender), "Create account");
        require(checkUserExists(friend_key), "Such user doesn't exist");
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    function readMessage(address friend_key) external view returns(message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    function getAllAppUser() public view returns(AllUserStruct[] memory){
        return getAllUsers;
    }
}