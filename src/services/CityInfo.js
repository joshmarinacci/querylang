// country is in https://en.wikipedia.org/wiki/ISO_3166
// lat lon is in decimal
// timezone is in UTC offsets
// state is full name
// abbreviations are expanded

const DATA = [
    {
        city:'Eugene',
        state:'Oregon',
        country:'US',
        latlon: [44.051944, -123.086667],
        timezone:'UTC-08'
    },
    {
        city:'San Francisco',
        state:'California',
        country:'US',
        latlon:[37.7775, -122.416389],
        timezone:'UTC-08',
    },
    {
        city:'Atlanta',
        state:'Georgia',
        country:'US',
        latlon:[33.755, -84.39],
        timezone:'UTC-05',
    },
    {
        city:'New York City',
        state:'New York',
        country:'US',
        latlon:[40.71274, -74.005974],
        timezone:'UTC-05',
    },
]

export function find_city(city, state) {
    return DATA.find((item => {
        return item.city.toLowerCase() === city.toLowerCase()
    }))
}