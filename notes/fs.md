new file system schema

There should be an importer service which is used to import data from elsewhere. Initially it will take a URL and return a new db object. It would scan the URL to learn about it, preferably in some sort of isolated environment. It also fully downloads the file to put into the data store (ie: the real underlying filesystem).  It should scan a url for

* the content length
* the mime type of the original content
* the filename. From the URL or sometimes internal to the doc (like a PDF?)
* metadata that can be extracted from the file. ex: EXIF data in JPGs.
* look at the starting bytes to verify that this really is the detected mime type. This needs lots of unit tests including for bad data that could try to mess it up.
* if the file is an HTML page, get the title and other metadata, like the author.
* is the file an RSS feed? Is it valid XML?
* If it’s an HTML page, does it contain an RSS feed?
* if it’s a webpage or other textual document, can we generate a summary or abstract? Is one already included in the doc?
* does it have any social share metadata?
* is it a podcast
* is it audio
* if it’s audio or video, what is the duration of the media in addition to the file length
* if it’s an image, what is the bit depth, resolution, size, and other data about it.



function run_tests() {

let url = new URL('scanningtests.json',import.meta.url)
let examples = await fs.readFile(url)

for(ex in examples) {
    let res = await scanExample(ex)
    compare(ex,res)
}

}

music
juanitos:
https://freemusicarchive.org/music/Juanitos
soft and furious:
https://freemusicarchive.org/music/Soft_and_Furious/You_know_where_to_find_me

big bg images from unsplash

spiral staircase: https://unsplash.com/photos/XKZmWh87zUs
https://unsplash.com/@tkirkgoz


spain opera house: https://unsplash.com/photos/4o-GTlAmP7g
Palau de les Arts Reina Sofía. Opera house, Valencia, Spain
https://unsplash.com/@cobblepot


boston MOFA scupture: https://unsplash.com/photos/sotOieQRmdw
A sculpture hanging from the ceiling of a museum.
https://unsplash.com/@tjscalzo


iceland: https://unsplash.com/photos/qdhiGlMXzOs
https://unsplash.com/@lenswithbenefits


sf fire sky: https://unsplash.com/photos/rAtADOlvcos
https://unsplash.com/@stay_in_touch
San Francisco 2020, after the labor day fires



5 space images
https://images-assets.nasa.gov/image/as12-47-6870/as12-47-6870~orig.jpg
https://images-assets.nasa.gov/image/as16-114-18421/as16-114-18421~orig.jpg
https://images.nasa.gov/details-as08-12-2188
https://images.nasa.gov/details-6972887
https://images.nasa.gov/details-as04-01-200


5 small headshot images
https://getavataaars.com/?accessoriesType=Round&avatarStyle=Circle&clotheType=BlazerSweater&eyeType=Dizzy&eyebrowType=AngryNatural&facialHairType=BeardMagestic&hairColor=Red&mouthType=Concerned&skinColor=Brown&topType=ShortHairFrizzle
https://joeschmoe.io




5 pdfs
20 text files. js, markdown, csv, 


https://trianglify.io


```json
    {
        "title":"Piano Sonata #14 in C Sharp Minor, Op. 27, Moonlight",
        "artist":"Arther Rubinstein",
        "album":"Beethoven Sonatas",
        "url":"https://apps.josh.earth/music/06%20Beethoven_%20Piano%20Sonata%20%2314%20In%20C%20Sharp%20Minor,%20Op.%2027_2,%20_Moonlight_%20-%203.%20Presto%20Agitato.mp3"
    }
```