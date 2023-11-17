let contract;
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        console.error('No Ethereum provider detected');
    }

    const contractAddress = '0x47B087B83cD9578C780fAF8c4A801192f4D3A688'; // Replace with your actual contract address
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "friend_key",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "addFriend",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "pubkey",
                    "type": "address"
                }
            ],
            "name": "checkUserExists",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "createAccount",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAllAppUser",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "accountAddress",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct ChatApp.AllUserStruct[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFriends",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "pubkey",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct ChatApp.friend[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "pubkey",
                    "type": "address"
                }
            ],
            "name": "getUsername",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "friend_key",
                    "type": "address"
                }
            ],
            "name": "readMessage",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "msg",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct ChatApp.message[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "friend_key",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_msg",
                    "type": "string"
                }
            ],
            "name": "sendMessage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    contract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Function to display all existing users
    async function displayFriends() {
        try {
            const friends = await getFriends();
            const friendsElement = document.getElementById('friendsList');
            for (const friend of friends) {
                const { name, pubkey } = friend;
                const friendInfoElement = document.createElement('div');
                friendInfoElement.classList.add('friend-card');
    
                const anchorElement = document.createElement('a');
                anchorElement.addEventListener('click', () => displayMessages(pubkey));
    
                const userItem = document.createElement('div');
                userItem.classList.add('user-item');
    
                const userImage = document.createElement('img');
                userImage.src = 'user.png';
                userImage.alt = 'User Logo';
                userImage.classList.add('user-logo');
    
                const userName = document.createElement('span');
                userName.textContent = name;
                userName.classList.add('user-name');
    
                userItem.appendChild(userImage);
                userItem.appendChild(userName);
                anchorElement.appendChild(userItem);
                friendInfoElement.appendChild(anchorElement);
                friendsElement.appendChild(friendInfoElement);
            }
        } catch (error) {
            console.error('Error displaying friends:', error);
        }
    }
    

    displayFriends()

});

async function getFriends() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0];

        const friends = await contract.methods.getFriends().call({ from: currentAccount });

        console.log('List of Friends:', friends);
        return friends
    } catch (error) {
        console.error('Error retrieving friends:', error);
    }
}
async function readMessages(friendAddress) {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0];

        const messages = await contract.methods.readMessage(friendAddress).call({ from: currentAccount });

        console.log('Messages with Friend:', messages);
        return messages
    } catch (error) {
        console.error('Error reading messages:', error);
    }
}

async function displayMessages(friendAddress) {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0];
        const friendUsername = await contract.methods.getUsername(friendAddress).call();
        const friends = await getFriends();
        const friendsElement = document.getElementById('friendsList');

        const receiverName = document.getElementById('receiver-name');
        const receiverAddress = document.getElementById('receiver-address');
        receiverName.textContent  = friendUsername;
        receiverAddress.textContent  = friendAddress;
        messages = await contract.methods.readMessage(friendAddress).call({ from: currentAccount });
        console.log(messages)
        const messagesContainer = document.getElementById("chat-messages")
        while (messagesContainer.firstChild) {
            messagesContainer.removeChild(messagesContainer.firstChild);
        }
        messages.forEach(async (message, index) => {
            const { msg, sender } = message;
            console.log(msg, sender, currentAccount)
            const msgElement = document.createElement('div');
            msgElement.classList.add('message');
            if (sender.toLowerCase() == currentAccount){
                msgElement.classList.add('sent');
            }else{
                msgElement.classList.add('received');
            }
            msgElement.innerHTML = `
            <p>${msg}</p>
                `;

                messagesContainer.appendChild(msgElement);
        });
    } catch (error) {
        console.error('Error displaying friends:', error);
    }
}
