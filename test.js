import fetch from 'node-fetch'

fetch('https://www.4lajf.com/api/autocomplete?query=test&type=title')
    .then(response => response.json())
    .then(response => {
        const ac = response.body.split('\n')
        console.log(ac)
        console.log(ac.length)
    });