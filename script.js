// Initialize Firebase
// TODO: Replace the below config with your own Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Elements
const agentForm = document.getElementById('agentForm');
const campaignsContainer = document.getElementById('campaignsContainer');

// Handle form submission
agentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const agentName = document.getElementById('agentName').value;
  const campaignTitle = document.getElementById('campaignTitle').value;
  const campaignDesc = document.getElementById('campaignDesc').value;
  const campaignPrice = document.getElementById('campaignPrice').value;
  const contactInfo = document.getElementById('contactInfo').value;
  const campaignImage = document.getElementById('campaignImage').files[0];

  let imageURL = '';
  if (campaignImage) {
    const storageRef = storage.ref('campaignImages/' + campaignImage.name);
    await storageRef.put(campaignImage);
    imageURL = await storageRef.getDownloadURL();
  }

  // Save campaign to Firestore
  await db.collection('campaigns').add({
    agentName,
    title: campaignTitle,
    description: campaignDesc,
    price: Number(campaignPrice),
    contact: contactInfo,
    imageURL,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  agentForm.reset();
  alert('Campaign submitted successfully!');
  loadCampaigns();
});

// Fetch campaigns and display
async function loadCampaigns() {
  campaignsContainer.innerHTML = '';
  const snapshot = await db.collection('campaigns').orderBy('createdAt', 'desc').get();
  snapshot.forEach(doc => {
    const data = doc.data();

    const card = document.createElement('div');
    card.classList.add('campaign-card');

    if (data.imageURL) {
      const img = document.createElement('img');
      img.src = data.imageURL;
      card.appendChild(img);
    }

    const title = document.createElement('h3');
    title.textContent = data.title;
    card.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = data.description;
    card.appendChild(desc);

    const price = document.createElement('span');
    price.textContent = `₹${data.price}`;
    card.appendChild(price);

    campaignsContainer.appendChild(card);
  });
}

// Initial load
loadCampaigns();
