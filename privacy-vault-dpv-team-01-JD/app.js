document.getElementById('toggleButton').addEventListener('click', function() {
    const message = document.getElementById('messageInput').value;
    const button = document.getElementById('toggleButton');
    const isAnon = button.textContent.includes('Anon');

    fetch(`http://localhost:3000/${isAnon ? 'anonymize' : 'deanonymize'}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = data.anonymizedMessage || data.deanonymizedMessage;
        button.textContent = isAnon ? 'De-Anon' : 'Anon';
    })
    .catch(error => console.error('Error:', error));
});
