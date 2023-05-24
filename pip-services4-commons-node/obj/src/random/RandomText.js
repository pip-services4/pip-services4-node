"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomText = void 0;
/** @module random */
const RandomInteger_1 = require("./RandomInteger");
const RandomString_1 = require("./RandomString");
const RandomBoolean_1 = require("./RandomBoolean");
/**
 * Random generator for various text values like names, addresses or phone numbers.
 *
 * ### Example ###
 *
 *     let value1 = RandomText.name();     // Possible result: "Segio"
 *     let value2 = RandomText.verb();      // Possible result: "Run"
 *     let value3 = RandomText.Text(50);    // Possible result: "Run jorge. Red high scream?"
 */
class RandomText {
    /**
     * Generates a random color name.
     * The result value is capitalized.
     *
     * @returns a random color name.
     */
    static color() {
        return RandomString_1.RandomString.pick(RandomText._colors);
    }
    /**
     * Generates a random noun.
     * The result value is capitalized.
     *
     * @returns a random noun.
     */
    static noun() {
        return RandomString_1.RandomString.pick(RandomText._stuffs);
    }
    /**
     * Generates a random adjective.
     * The result value is capitalized.
     *
     * @returns a random adjective.
     */
    static adjective() {
        return RandomString_1.RandomString.pick(RandomText._adjectives);
    }
    /**
     * Generates a random verb.
     * The result value is capitalized.
     *
     * @returns a random verb.
     */
    static verb() {
        return RandomString_1.RandomString.pick(RandomText._verbs);
    }
    /**
     * Generates a random phrase which consists of few words separated by spaces.
     * The first word is capitalized, others are not.
     *
     * @param minLength     (optional) minimum string length.
     * @param maxLength     maximum string length.
     * @returns a random phrase.
     */
    static phrase(minLength, maxLength = null) {
        maxLength = Math.max(minLength, maxLength || minLength);
        let size = RandomInteger_1.RandomInteger.nextInteger(minLength, maxLength);
        if (size <= 0)
            return "";
        let result = '';
        result += RandomString_1.RandomString.pick(RandomText._allWords);
        while (result.length < size) {
            result += " " + RandomString_1.RandomString.pick(RandomText._allWords).toLowerCase();
        }
        return result;
    }
    /**
     * Generates a random person's name which has the following structure
     * <optional prefix> <first name> <second name> <optional suffix>
     *
     * @returns a random name.
     */
    static fullName() {
        let result = '';
        if (RandomBoolean_1.RandomBoolean.chance(3, 5)) {
            result += RandomString_1.RandomString.pick(RandomText._namePrefixes) + " ";
        }
        result += RandomString_1.RandomString.pick(RandomText._firstNames)
            + " " + RandomString_1.RandomString.pick(RandomText._lastNames);
        if (RandomBoolean_1.RandomBoolean.chance(5, 10)) {
            result += " " + RandomString_1.RandomString.pick(RandomText._nameSuffixes);
        }
        return result;
    }
    /**
     * Generates a random word from available first names, last names, colors, stuffs, adjectives, or verbs.
     *
     * @returns a random word.
     */
    static word() {
        return RandomString_1.RandomString.pick(RandomText._allWords);
    }
    /**
     * Generates a random text that consists of random number of random words separated by spaces.
     *
     * @param min   (optional) a minimum number of words.
     * @param max   a maximum number of words.
     * @returns     a random text.
     */
    static words(min, max = null) {
        let result = '';
        let count = RandomInteger_1.RandomInteger.nextInteger(min, max || min);
        for (let i = 0; i < count; i++) {
            result += RandomString_1.RandomString.pick(RandomText._allWords);
        }
        return result;
    }
    /**
     * Generates a random phone number.
     * The phone number has the format: (XXX) XXX-YYYY
     *
     * @returns a random phone number.
     */
    static phone() {
        let result = '';
        result += "("
            + RandomInteger_1.RandomInteger.nextInteger(111, 999)
            + ") "
            + RandomInteger_1.RandomInteger.nextInteger(111, 999)
            + "-"
            + RandomInteger_1.RandomInteger.nextInteger(0, 9999);
        return result;
    }
    /**
     * Generates a random email address.
     *
     * @returns a random email address.
     */
    static email() {
        return RandomText.words(2, 6) + "@" + RandomText.words(1, 3) + ".com";
    }
    /**
     * Generates a random text, consisting of first names, last names, colors, stuffs, adjectives, verbs, and punctuation marks.
     *
     * @param minLength   minimum amount of words to generate. Text will contain 'minSize' words if 'maxSize' is omitted.
     * @param maxLength   (optional) maximum amount of words to generate.
     * @returns         a random text.
     */
    static text(minLength, maxLength = null) {
        maxLength = Math.max(minLength, maxLength || minLength);
        let size = RandomInteger_1.RandomInteger.nextInteger(minLength, maxLength);
        let result = '';
        result += RandomString_1.RandomString.pick(RandomText._allWords);
        while (result.length < size) {
            let next = RandomString_1.RandomString.pick(RandomText._allWords);
            if (RandomBoolean_1.RandomBoolean.chance(4, 6))
                next = " " + next.toLowerCase();
            else if (RandomBoolean_1.RandomBoolean.chance(2, 5))
                next = RandomString_1.RandomString.pickChar(":,-") + next.toLowerCase();
            else if (RandomBoolean_1.RandomBoolean.chance(3, 5))
                next = RandomString_1.RandomString.pickChar(":,-") + " " + next.toLowerCase();
            else
                next = RandomString_1.RandomString.pickChar(".!?") + " " + next;
            result += next;
        }
        return result;
    }
}
exports.RandomText = RandomText;
RandomText._namePrefixes = ["Dr.", "Mr.", "Mrs"];
RandomText._nameSuffixes = ["Jr.", "Sr.", "II", "III"];
RandomText._firstNames = [
    "John", "Bill", "Andrew", "Nick", "Pamela", "Bela", "Sergio", "George", "Hurry", "Cecilia", "Vesta", "Terry", "Patrick"
];
RandomText._lastNames = [
    "Doe", "Smith", "Johns", "Gates", "Carmack", "Zontak", "Clinton", "Adams", "First", "Lopez", "Due", "White", "Black"
];
RandomText._colors = [
    "Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Grey", "Magenta", "Cian"
];
RandomText._stuffs = [
    "Game", "Ball", "Home", "Board", "Car", "Plane", "Hotel", "Wine", "Pants", "Boots", "Table", "Chair"
];
RandomText._adjectives = [
    "Large", "Small", "High", "Low", "Certain", "Fuzzy", "Modern", "Faster", "Slower"
];
RandomText._verbs = [
    "Run", "Stay", "Breeze", "Fly", "Lay", "Write", "Draw", "Scream"
];
// private static readonly _streetTypes = [
//     "Lane", "Court", "Circle", "Drive", "Way", "Loop", "Blvd", "Street"
// ];
// private static readonly _streetPrefix = [
//     "North", "South", "East", "West", "Old", "New", "N.", "S.", "E.", "W."
// ];
// private static readonly _streetNames = [
//     "1st", "2nd", "3rd", "4th", "53rd", "6th", "8th", "Acacia", "Academy", "Adams", "Addison", "Airport", "Albany", "Alderwood", "Alton", "Amerige", "Amherst", "Anderson",
//     "Ann", "Annadale", "Applegate", "Arcadia", "Arch", "Argyle", "Arlington", "Armstrong", "Arnold", "Arrowhead", "Aspen", "Augusta", "Baker", "Bald Hill", "Bank", "Bay Meadows",
//     "Bay", "Bayberry", "Bayport", "Beach", "Beaver Ridge", "Bedford", "Beech", "Beechwood", "Belmont", "Berkshire", "Big Rock Cove", "Birch Hill", "Birchpond", "Birchwood",
//     "Bishop", "Blackburn", "Blue Spring", "Bohemia", "Border", "Boston", "Bow Ridge", "Bowman", "Bradford", "Brandywine", "Brewery", "Briarwood", "Brickell", "Brickyard",
//     "Bridge", "Bridgeton", "Bridle", "Broad", "Brookside", "Brown", "Buckingham", "Buttonwood", "Cambridge", "Campfire", "Canal", "Canterbury", "Cardinal", "Carpenter",
//     "Carriage", "Carson", "Catherine", "Cedar Swamp", "Cedar", "Cedarwood", "Cemetery", "Center", "Central", "Chapel", "Charles", "Cherry Hill", "Chestnut", "Church", "Circle",
//     "Clark", "Clay", "Cleveland", "Clinton", "Cobblestone", "Coffee", "College", "Colonial", "Columbia", "Cooper", "Corona", "Cottage", "Country Club", "Country", "County", "Court",
//     "Courtland", "Creek", "Creekside", "Crescent", "Cross", "Cypress", "Deerfield", "Del Monte", "Delaware", "Depot", "Devon", "Devonshire", "Division", "Dogwood", "Dunbar",
//     "Durham", "Eagle", "East", "Edgefield", "Edgemont", "Edgewater", "Edgewood", "El Dorado", "Elizabeth", "Elm", "Essex", "Euclid", "Evergreen", "Fairfield", "Fairground", "Fairview",
//     "Fairway", "Fawn", "Fifth", "Fordham", "Forest", "Foster", "Foxrun", "Franklin", "Fremont", "Front", "Fulton", "Galvin", "Garden", "Gartner", "Gates", "George", "Glen Creek",
//     "Glen Eagles", "Glen Ridge", "Glendale", "Glenlake", "Glenridge", "Glenwood", "Golden Star", "Goldfield", "Golf", "Gonzales", "Grand", "Grandrose", "Grant", "Green Hill",
//     "Green Lake", "Green", "Greenrose", "Greenview", "Gregory", "Griffin", "Grove", "Halifax", "Hamilton", "Hanover", "Harrison", "Hartford", "Harvard", "Harvey", "Hawthorne",
//     "Heather", "Henry Smith", "Heritage", "High Noon", "High Point", "High", "Highland", "Hill Field", "Hillcrest", "Hilldale", "Hillside", "Hilltop", "Holly", "Homestead",
//     "Homewood", "Honey Creek", "Howard", "Indian Spring", "Indian Summer", "Iroquois", "Jackson", "James", "Jefferson", "Jennings", "Jockey Hollow", "John", "Johnson", "Jones",
//     "Joy Ridge", "King", "Kingston", "Kirkland", "La Sierra", "Lafayette", "Lake Forest", "Lake", "Lakeshore", "Lakeview", "Lancaster", "Lane", "Laurel", "Leatherwood", "Lees Creek",
//     "Leeton Ridge", "Lexington", "Liberty", "Lilac", "Lincoln", "Linda", "Littleton", "Livingston", "Locust", "Longbranch", "Lookout", "Lower River", "Lyme", "Madison", "Maiden",
//     "Main", "Mammoth", "Manchester", "Manhattan", "Manor Station", "Maple", "Marconi", "Market", "Marsh", "Marshall", "Marvon", "Mayfair", "Mayfield", "Mayflower", "Meadow",
//     "Meadowbrook", "Mechanic", "Middle River", "Miles", "Mill Pond", "Miller", "Monroe", "Morris", "Mountainview", "Mulberry", "Myrtle", "Newbridge", "Newcastle", "Newport",
//     "Nichols", "Nicolls", "North", "Nut Swamp", "Oak Meadow", "Oak Valley", "Oak", "Oakland", "Oakwood", "Ocean", "Ohio", "Oklahoma", "Olive", "Orange", "Orchard", "Overlook",
//     "Pacific", "Paris Hill", "Park", "Parker", "Pawnee", "Peachtree", "Pearl", "Peg Shop", "Pendergast", "Peninsula", "Penn", "Pennington", "Pennsylvania", "Pheasant", "Philmont",
//     "Pierce", "Pin Oak", "Pine", "Pineknoll", "Piper", "Plumb Branch", "Poor House", "Prairie", "Primrose", "Prince", "Princess", "Princeton", "Proctor", "Prospect", "Pulaski",
//     "Pumpkin Hill", "Purple Finch", "Queen", "Race", "Ramblewood", "Redwood", "Ridge", "Ridgewood", "River", "Riverside", "Riverview", "Roberts", "Rock Creek", "Rock Maple",
//     "Rockaway", "Rockcrest", "Rockland", "Rockledge", "Rockville", "Rockwell", "Rocky River", "Roosevelt", "Rose", "Rosewood", "Ryan", "Saddle", "Sage", "San Carlos", "San Juan",
//     "San Pablo", "Santa Clara", "Saxon", "School", "Schoolhouse", "Second", "Shadow Brook", "Shady", "Sheffield", "Sherman", "Sherwood", "Shipley", "Shub Farm", "Sierra",
//     "Silver Spear", "Sleepy Hollow", "Smith Store", "Smoky Hollow", "Snake Hill", "Southampton", "Spring", "Spruce", "Squaw Creek", "St Louis", "St Margarets", "St Paul", "State",
//     "Stillwater", "Strawberry", "Studebaker", "Sugar", "Sulphur Springs", "Summerhouse", "Summit", "Sunbeam", "Sunnyslope", "Sunset", "Surrey", "Sutor", "Swanson", "Sycamore",
//     "Tailwater", "Talbot", "Tallwood", "Tanglewood", "Tarkiln Hill", "Taylor", "Thatcher", "Third", "Thomas", "Thompson", "Thorne", "Tower", "Trenton", "Trusel", "Tunnel",
//     "University", "Vale", "Valley Farms", "Valley View", "Valley", "Van Dyke", "Vermont", "Vernon", "Victoria", "Vine", "Virginia", "Wagon", "Wall", "Walnutwood", "Warren",
//     "Washington", "Water", "Wayne", "Westminster", "Westport", "White", "Whitemarsh", "Wild Rose", "William", "Williams", "Wilson", "Winchester", "Windfall", "Winding Way",
//     "Winding", "Windsor", "Wintergreen", "Wood", "Woodland", "Woodside", "Woodsman", "Wrangler", "York",
// ];
RandomText._allWords = RandomText._firstNames.concat(RandomText._lastNames).concat(RandomText._colors)
    .concat(RandomText._stuffs).concat(RandomText._adjectives).concat(RandomText._verbs);
//# sourceMappingURL=RandomText.js.map