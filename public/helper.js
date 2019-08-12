function returnSocket(){
	var socket_server_ip = ['http://quipr-final.herokuapp.com/', 'https://cb99026a.ngrok.io', 'http://localhost:4000']
	return io.connect(socket_server_ip[0]);
}

function getPromptFromIdAndDisplay(prompt_id){
    //now it returns a string instead of printing to website by default.
	return prompts[prompt_id];
}

prompts = ["What two words would passengers never want to hear a pilot say?",//I'm drunk, Im drunk 
           "You would never go on a roller coaster called _____",//the decapitator, the decapitater, decapitator, decapitater 
           "The secret to a happy life",//playing Quiplash 
           "If a winning coach gets Gatorade dumped on his head, what should get dumped on the losing coach?",//Powerade 
           "Name a candle scent designed specifically for Kim Kardashian",//untalented, un talented 
           "You should never give alcohol to _____",//a mogwai, mogwai, the mogwai 
           "Everyone knows that monkeys hate _____",//sarcasm 
           "The biggest downside to living in Hell",//bad wifi, no wifi, spotty wifi, wifi, wi-fi 
           "Jesus's REAL last words",//ouch 
           "The worst thing for an evil witch to turn you into",//tampon, maxi pad 
           "The Skittles flavor that just missed the cut",//dirty underwear 
           "On your wedding night, it would be horrible to find out that the person you married is _____",//vegetarian 
           "A name for a really bad Broadway musical",//Linsday Lohan the Musical, Lindsey Lohan the Musical, Lindsey Lohan: the Musical, Lindsay Lohan: the Musical 
           "A name for a brand of designer adult diapers",//Abercrombie and Shits 
           "Name a TV drama that's about a vampire doctor",//Monster Mash 
           "Something squirrels probably do when no one is looking",//masturbate, masterbate, masturbait, masterbait 
           "The crime you would commit if you could get away with it",//regicide 
           "Come up with a great title for the next awkward teen sex movie",//boner time 
           "What's the Mona Lisa smiling about?",//she's not wearing pants, shes not wearing pants 
           "A terrible name for a cruise ship",//Animal Love Boat, The Animal Love Boat 
           "What FDR meant to say was We have nothing to fear, but _____ ",//chupacabra, chupacabras, the chupacabra 
           "Come up with a title for an adult version of any classic video game",//The egend of Zelda's Ass 
           "The name of a font nobody would ever use",//Comic sans 
           "Something you should never put on an open wound",//ketchup 
           "Scientists say erosion, but we all know the Grand Canyon was actually made by _____",//my dick, my cock 
           "The real reason the dinosaurs died",//they crossed me 
           "Come up with the name of a country that doesn't exist",//Canada 
           "The best way to keep warm on a cold winter night",//orgy 
           "A college major you don't see at many universities",//Coloring 
           "What would make baseball more entertaining to watch?",//make it football 
           "The best thing about going to prison",//free orange jumpsuit, free jumpsuit, orange jumpsuit, the free orange jumpsuit, the free jumpsuit, the orange jumpsuit 
           "The best title for a new national anthem for the USA",//guns, Guns!, gun 
           "Come up with the name of book that would sell a million copies, immediately",//The big book of boobs, big book of boobs 
           "What would you do if you were left alone in the White House for an hour?",//pass a law, pass laws, pass some laws 
           "Invent a family-friendly replacement word that you could say instead of an actual curse word",//Flufflepuff 
           "A better name for testicles",//Man Orbs 
           "The name of the reindeer Santa didn't pick to pull his sleigh",//Crasher 
           "What's the first thing you would do if you could time travel?",//eat a dinosaur, eat some dinosaurs, eat dinosaurs 
           "The name of a pizza place you should never order from",//Pizza Butt 
           "A not-very-scary name for a pirate",//Johnny Depp 
           "Come up with a name for a beer made especially for monkeys",//High Life 
           "The best thing about living in an igloo",//beer always cold, cold beer, beer's always cold, keeps beer cold, keeps beer nice and cold, beer's always nice and cold, the beer's always cold, the beer stays cold, beer stays cold 
           "The worst way to be murdered",//with a spoon 
           "Something you shouldn't get your significant other for Valentine's Day",//a scale, scale 
           "A dangerous thing to do while driving",//load a gun, loading a gun, load your gun, loading your gun 
           "Something you shouldn't wear to a job interview",//wife beater, a wife beater, wife beater tshirt, wifebeater, wife beater t shirt, a wife beater t shirt 
           "The #1 reason penguins can't fly",//they're lazy, too lazy 
           "Using only two words, a new state motto for Texas",//Bush Country 
           "The hardest thing about being Batman",//cleaning the cave, cave cleaning 
           "A great way to kill time at work",//working, work 
           "Come up with a really bad TV show that starts with Baby ",//baby cop, baby cops 
           "Why does the Tower of Pisa lean?",//gravity, gravity dumbass, fucking gravity, fuckin gravity, gravity duh 
           "What's wrong with these kids today?",//Rock music 
           "A great new invention that starts with Automatic ",//automatic buttscratcher, automatic butt scratcher 
           "Come up with a really bad football penalty that begins with Intentional",//Sucking, Intentional sucking 
           "A Starbucks coffee that should never exist",//Capoochino, ca-poo-chino 
           "There's Gryffindor, Ravenclaw, Slytherin, and Hufflepuff, but what's the Hogwarts house few have ever heard of?",//suckandpuff, suckenpuff, suck-n-puff 
           "The worst words to say for the opening of a eulogy at a funeral",//He was an asshole, he was an ass, she was an asshole, she was an ass 
           "Something you should never use as a scarf",//anaconda, anuconda, aneconda, an aneconda, an anaconda 
           "Invent a holiday that you think everyone would enjoy",//Spanksgiving, spanks-giving 
           "The best news you could get today",//it's not contagious, its not contagious, it's not contageous, its not contageous, it's not contagus, its not contagus 
           "Usually, it's bacon,lettuce and tomato, but come up with a BLT you wouldn't want to eat",//Boogers Lint and Toenails, boogers lint toenails 
           "The worst thing you could stuff a bed mattress with",//spiders 
           "A great opening line to start a conversation with a stranger at a party",//I see dead people 
           "Something you would like to fill a swimming pool with",//pudding 
           "Miley Cyrus' Wi-Fi password, possibly",//teddybearhumper 
           "If you were allowed to name someone else's baby any weird thing you wanted, what would you name it?",//Cookie Masterson, Cookie 
           "A fun thing to think about during mediocre sex",//Game of Thrones 
           "You know you're in for a bad taxi ride when _____",//your driver dies, the driver dies, the driver is dead, driver dies 
           "Where do babies come from?",//Krypton 
           "Sometimes, after a long day, you just need to _____",//kick a squirrel 
           "The worst way to spell Mississippi",//butthole 
           "Give me one good reason why I shouldn't spank you right now",//I don't have a butt, no butt, i have no butt, i have no ass, no ass, i don't have an ass 
           "The best pick-up line for an elderly singles mixer",//I've fallen in love and I can't get up, I've fallen in love and I can't get it up, help I've fallen in love and I can't get up, help I've fallen in love and I can't get it up 
           "A good stage name for a chimpanzee stripper",//Ape-ril, aperil, 
           "The best place to bury all those bodies",//enemy's backyard, backyard of enemy, your enemy's yard, enemy's yard, your enemy's back yard, your enemy's backyard 
           "One place a finger shouldn't go",//peehole, pee hole 
           "Come up with a name for the most difficult yoga pose known to mankind",//downward hog 
           "What's lurking under your bed when you sleep?",//Mormons 
           "The name of a canine comedy club with puppy stand-up comedians",//Laugha Apso, Lhafa Apso, laffa apso, laff-a apso, laugh-a apso 
           "A great name for a nude beach in Alaska",//Blue ball beach, blue balls beach 
           "Make up the title of a movie that is based on the first time you had sex",//The Neverending Story, the never ending story 
           "A vanity license plate a jerk in an expensive car would get",//WINNING 
           "A good fake name to use when checking into a hotel",//Jack Torrance, Danny Torrance, jack torrence, danny torrence 
           "A good catchphrase to yell every time you finish pooping",//Operation Dumbo Drop 
           "The Katy Perry Super Bowl halftime show would have been better with _____",//sharks, cartoon sharks, shark costumes, dancing sharks 
           "Okay... fine! What do YOU want to talk about then?!!!",//philosophy 
           "Miller Lite beer would make a lot of money if they came up with a beer called Miller Lite _____",//NOT! 
           "Something you should never stick up your butt",//burrito, a burrito, burritos 
           "A terrible name for a clown",//Suckles 
           "An inappropriate thing to do at a cemetery",//Live, be alive 
           "Like chicken fingers or chicken poppers, a new appetizer name for your fun, theme restaurant: chicken _____",//faces 
           "Thing you'd be most surprised to have a dentist a find in your mouth",//his penis, his dick, his cock 
           "Rename Winnie-the-Pooh to something more appropriate/descriptive",//Winnie-the-Pantless, Winnie the Pantless 
           "An alternate use for a banana",//back scratcher 
           "What you'd guess is an unadvertised ingredient in most hot dogs",//orphans, unadopted orphans, unclaimed orphans 
           "Name your new haircutting establishment",//Scissor Me Timbers 
           "Something that would make an awful hat",//salmon, a salmon 
           "How many monkeys is too many monkeys?",//Twelve, 12, Twelve Monkeys 
           "Something you'd be surprised to see a donkey do",//taxes, his taxes, its taxes, fill out taxes, fill out his taxes, fill out its taxes 
           "The title you'd come up with if you were writing the Olympics theme song",//I Torch Myself 
           "Something you should never say to your mother",//you're a milf, what a milf 
           "Come up with a name for a new, very manly cocktail",//teste tequila, testes tequila, tequila testes, tequila teste 
           "Where's the best place to hide from the shadow monsters?",//at their house 
           "The three ingredients in the worst smoothie ever",//poop barf and greek yogurt, barf poop and greek yogurt, greek yogurt poop and barf, greek yogurt barf and poop, barf greek yogurt and poop 
           "The best thing to use when you're out of toilet paper",//sandpaper, sand paper 
           "Come up with a catchier, more marketable name for the Bible",//Fifty Shades of Pray 
           "The most presidential name you can think of (that isn't already the name of a president,",//Kevin 
           "A good way to get fired",//come to work naked, go to work naked, go to work nude, come to work nude, go nude, go naked, get naked 
           "If we can't afford to bury or cremate you, what should we do with your body?",//hide it 
           "Name the eighth dwarf, who got cut at the last minute",//Barfy 
           "A good place to hide boogers",//in your butt, in your ass, inside your butt, inside butt, inside your ass, inside ass, in butt, in ass, butt, ass 
           "Come up with the name for a new TV show with the word Spanky in it",//Better Call Spanky 
           "A fun trick to play on the Pope",//stealing the pope mobile, stealing the popemobile, steal the popemobile, steal popemobile, steal the pope mobile, steal pope mobile 
           "Where do you think the beef really is?",//In Iraq, iraq 
           "Something it'd be fun to throw off the Eiffel Tower",//mimes, mime, a mime 
           "Write a newspaper headline that will really catch people's attention",//Earth Explodes 
           "The worst job title that starts with Assistant ",//proctologist, assistant proctologist, proctalogist, assistant proctalogist 
           "The last person you'd consider inviting to your birthday party",//Jesus 
           "The grossest thing you'd put in your mouth for $18",//my own penis, my penis 
           "What John Goodman's belches smell like",//old Funyons 
           "The name of a new perfume by Betty White",//Golden Girl 
           "The worst name for a robot",//Chappie 
           "The first names of each of your nipples",//Nipsey and Russell, Nipsey Russell, Nipsy and russell, nipsy russell, nipsy & russell, nipsey & russell 
           "The most embarrassing name for a dog",//No Balls 
           "The worst thing you could discover in your burrito",//ebola 
           "One thing never to do on a first date",//die 
           "Ozzy Osbourne's Twitter password, probably",//batheads, bathead, bat heads, bat head 
           "Who let the dogs out?",//Obama, President Obama 
           "What do vegans taste like?",//sadness 
           "An item NOT found in Taylor Swift's purse",//mirror, a mirror 
           "Name a new reggae band made up entirely of chickens",//UBeak40 
           "Name a children's book by someone who hates children",//You're Not Special 
           "The name of your new plumbing company",//Super Mario Bros, Super Mario Brothers, Mario Brothers, Super Mario's Plumbing, Super Mario Bros Plumbing, mario bros plumbing, super mario plumbers, super mario bros plumbers, mario bros plumbers 
           "Make up a word that describes the sound of farting into a bowl of mac & cheese",//Blart 
           "A new ice cream flavor that no one would ever order",//kale 
           "Name a new movie starring a talking goat who is president of the United States",//GOTUS 
           "Something that would not work well as a dip for tortilla chips",//other tortilla chips, tortilla chips, more tortilla chips, crushed tortilla chips 
           "If God has a sense of humor, he welcomes people to heaven by saying, _____ ",//we're full, no vacancy, heaven is full, sorry we're full, no room at the inn, sorry no room at the inn, it's full, we're full up, there's no room left 
           "The name of a clothing store for overweight leprechauns",//Fatty Patty's 
           "Something upsetting you could say to the cable guy as he installs your television service",//you're never leaving, you'll never leave, you'll never leave here, you can't leave now, i'm not letting you leave 
           "The worst thing that could jump out of a bachelor party cake",//Betty White 
           "Come up with a name for a new beer marketed toward babies",//Milkwaukee's Breast, Milwaukee's Breast, Milkwaukees Breast 
           "A terrible theme for a high school prom",//9/11, September 11, September 11th 
           "Make up a name for a silent-film porno from the 1920s",//The Jizz Singer
		   ]