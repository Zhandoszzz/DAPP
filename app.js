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
    function displayAllUsers() {
        contract.methods.getAllAppUser().call((error, result) => {
            if (!error) {
                const allUsersElement = document.getElementById('allUsers');
                result.forEach((user, index) => {
                    const { name, accountAddress } = user;
                    const userInfoElement = document.createElement('div');
                    userInfoElement.classList.add('user-card');                    
                    userInfoElement.innerHTML = `
      <h2 class="user-name">${name}</h2>
      <p class="user-address">${accountAddress}</p>
      <button class="add-friend-btn" onclick="addFriend('${accountAddress}','${name}')" >Add Friend</button>
          `;
                    allUsersElement.appendChild(userInfoElement);
                    console.log(allUsersElement)
                });
            } else {
                console.error('Error fetching users:', error);
            }
        });
    }

    displayAllUsers();


});
async function createUser() {

    try {

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const name = document.querySelector('#nameInput').value

        console.log(name, account)
        // Call the contract's createAccount function to create a new user
        const tx = await contract.methods.createAccount(name).send({
            from: account,
        });

        // Transaction successful
        console.log('User created:', tx);
        alert('User created successfully!');

        window.location.href = 'chat.html';

    } catch (error) {

        console.error('Error creating user:', error.message);

        alert('Error creating user. Please check the console.');
    }
}

//check
async function addFriend(friendAddress, friendName) {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0];

        const result = await contract.methods.addFriend(friendAddress, friendName).send({ from: currentAccount });

        console.log('Friend added:', result);
    } catch (error) {
        console.error('Error adding friend:', error);
    }
}

//check
async function getFriends() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0];

        const friends = await contract.methods.getFriends().call({ from: currentAccount });

        console.log('List of Friends:', friends);
    } catch (error) {
        console.error('Error retrieving friends:', error);
    }
}
//check
async function readMessages(friendAddress) {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0];

        // Call the contract method 'readMessage'
        const messages = await contract.methods.readMessage(friendAddress).call({ from: currentAccount });

        // Handle the retrieved messages
        console.log('Messages with Friend:', messages);
        // You can perform additional actions or UI updates with the messages
    } catch (error) {
        // Handle errors
        console.error('Error reading messages:', error);
    }
}



function redirectToMainPage() {
    window.location.href = 'landing.html';
}