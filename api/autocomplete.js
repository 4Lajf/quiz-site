import fs from 'fs'
let artists, titles;

fs.readFile('titles.txt', 'utf8', function (err, data) {
    titles = data
});

fs.readFile('artists.txt', 'utf8', function (err, data) {
    artists = data
});

artists = artists.split('\n')
titles = titles.split('\n')

export default function handler(request, response) {
    const query = request.query.query
    const type = request.query.type

    const filterData = (data, query) => {
        return data.filter((x => x.toLowerCase().includes(query.toLowerCase())))
    }

    const autocomplete = (data, query) => {
        data = filterData(data, query)
        for (let i = 0; i < data.length; i++) {
            data[i] = `\`${data[i]}\`,\n`

        }
        return data.join(``);
    }

    switch (type) {
        case 'title':
            response.status(200).json({
                body: autocomplete(titles, query)
            });
            break;
        case 'artist':
            response.status(200).json({
                body: autocomplete(artists, query)
            });
            break;
        default:
            response.status(400).json({
                body: `Error: Invalid Type\nExpected either "title" or "artist" got "${type}"`
            });
            break;
    }
}