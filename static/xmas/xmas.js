const states = {
    initial: {
        text: "You wake up shivering. Tyler threw all the blankies on the floor again. You look outside and see a blinding white light. It's snowing! You look over and Tyler is still sound asleep.",
        options: [{
            text: "Wake him up so you can watch the snow together.",
            nextState: "a1",
        }, {
            text: "Ask where Pepperoni is and let her wake him up.",
            nextState: "a2",
        }, {
            text: "Just lie there and wait until he gets up on his own",
            nextState: "a3",
        }]
    },
    a1: {
        text: "You give Tyler a big shake and look at him with bright eyes and a wide grin.\"It's a Christmas miracle! It's snowin it's snowin!!\"\nTyler rolls over and looks out the window. \"Woooow! It's so cold out there! Pep is gonna hate going outside and poopins time. Isn't that right pep?\"\nHe calls out to her, but there's no waggling from under the blankie.",
        options: [{
            text: "\"Peppeppep!\"",
            nextState: "b1",
        }, {
            text: "Look under the blankies and try to find her",
            nextState: "b2",
        }, {
            text: "Get up and see if she follows you",
            nextState: "b3",
        }]
    },
    a2: {
        text: "\"Where's Pepperoni! Peppeppep! Come here beautiful girl!\"\nBut there is not so much as a waggle underneath the sheets.",
        options: [{
            text: "Maybe she's harassing Bella, better check around the apartment.",
            nextState: "b3",
        }, {
            text: "Wake Tyler up and ask if he knows where's Pepperoni.",
            nextState: "b4",
        }]
    },
    a3: {
        text: "You wait about an hour, but he still isn't up yet! He just keeps snorin'.",
        options: [{
            text: "Give in and wake him up so you can watch the snow together.",
            nextState: "a1",
        }, {
            text: "Get Pep to do your dirty work for you, coward.",
            nextState: "a2",
        }, {
            text: "Just lie there and wait until he gets up on his own",
            nextState: "a3",
        }]
    },

    b1: {
        text: "\"Where's Pepperoni! Peppeppep! Come here beautiful girl!\"\nBut there's no luck. She isn't in bed with you.",
        options: [{
            text: "Get up and see if she is anywhere around",
            nextState: "b3",
        }, {
            text: "Panic and start crying.",
            nextState: "b5",
        }]
    },
    b2: {
        text: "You lift the blankies up but all you see is Tyler's penis. No sign of Pepperoni.",
        options: [{
            text: "Get up and see if she is anywhere around",
            nextState: "b3",
        }, {
            text: "Panic and start crying.",
            nextState: "b5",
        }]
    },
    b3: {
        text: "You get up but Pepperoni is nowhere to be seen in the room. You go check around the apartment but you can't find her! All the doors and windows are closed, she couldn't have got out on her own... Right?",
        options: [{
            text: "Get your coat on, it's time for a CHRISTMAS ADVENTURE!!!",
            nextState: "title"
        }]
    },
    b4: {
        text: "You shake Tyler awake. \"Tyler I can't find Pepperoni.\", there is an audible quiver in your voice.\nTyler looks around. \"Did she go to her crate?\"\nYou look over and she isn't there either. You get a sinking feeling in the pit of your stomach.",
        options: [{
            text: "Get up and see if she is anywhere around",
            nextState: "b3",
        }, {
            text: "Panic and start crying.",
            nextState: "b5",
        }]
    },
    b5: {
        text: "You panic and start crying. Tyler sits up and tousles your hair a bit. \"Don't cry, she's just got off to somewhere in the house. She's not Smolboi, she can't get out on her own.\"\nYou give a solemn nod and recompose yourself.",
        options: [{
            text: "Get up and see if she is anywhere around",
            nextState: "b3",
        }]
    },

    title: {
        text: "The Search for Mrs. Pepperoni Dog - A Christmas Special\nStarring...\nYou!",
        options: [{
            text: "Continue",
            nextState: "c1",
        }]
    },

    c1: {
        text: "You get bundled up in your warmest snowy attire and get ready to get going. Tyler is ready first, as always. But he was waiting so long for you to get done bundling up that he ends up needing to go potty before you head out. Anyway, after a few minutes, you're all ready to go!",
        options: [{
            text: "Take the elevator down, it's faster",
            nextState: "c2",
        }, {
            text: "Better take the stairs just in case the elevator breaks down and we get stuck in there forever.",
            nextState: "c3",
        }]
    },
    c2: {
        text: "You get in the elevator. It's totally fine like always and nothing goes wrong.",
        options: [{
            text: "Head outside",
            nextState: "d1",
        }]
    },
    c3: {
        text: "You bolt down the stairs quick as a flash and before you know it, you get down to the ground floor.",
        options: [{
            text: "Head outside",
            nextState: "d1",
        }]
    },

    d1: {
        text: "You get outside. It's still snowing, but not too hard. You can see what looks like little puppy-print pawsteps in the snow. You also see a Christmas elf on the other side of the road. It looks like she has been standing around all morning, maybe she saw something.",
        options: [{
            text: "Follow the paw prints! That must be Pep.",
            nextState: "d2",
        }, {
            text: "Go up to the Christmas elf and see if she can help",
            nextState: "d3",
        }]
    },
    d2: {
        text: "You follow the puppy paw prints for a little while but eventually they fade away. You get a bad feeling, but suddenly you look up and see..\n\n\nSome other tiny dog that made the tracks in the snow. Not Pep.",
        options: [{
            text: "Guess we gotta talk to the Christmas elf",
            nextState: "d3",
        }, {
            text: "Maybe that little dog is Pep in disguise, better investigate.",
            nextState: "d4",
        }]
    },
    d3: {
        text: "You run up to the Christmas elf. \"Excuse me Ms. elf lady! Did you happen to see a tiny Pepperoni dog walking around all by herself this morning? We can't find her anywhere!\"\nThe Christmas elf scratches her beard as she thinks for a moment. \"You know,\" she mutters, \"Come to think of it, I do think I saw that little Pep! She was waddling her way to the Cookie Palace over on Gumdrop street, around the corner from the sketchy dumpster.\"\nTyler jumps in, \"That makes sense, Pep loves that place since they always give her extra extra treats!\"\nYou nod and get ready to sprint off. \"Thanks Christmas elf! We gotta go save Pep now!\"\nThe Christmas elf blows you a kiss and wishes you good luck.",
        options: [{
            text: "Head to the Cookie Palace. Maybe she's still there?",
            nextState: "e1",
        }, {
            text: "Go around the back way to the Cookie Palace. We gotta check out that dumpster.",
            nextState: "e2",
        }]
    },
    d4: {
        text: "He obviously isn't pep. Worth a shot I guess.",
        options: [{
            text: "Ok fine, time to talk to the elf.",
            nextState: "d3",
        }]
    },

    e1: {
        text: "You walk into the Cookie Palace! It is beautiful and grand as always. The specials on the menu are PB&J cookies, chamomile lemondrop cookies, and peppermint espresso cookies. The nutcracker at the door seems to be waving at you, and the man at the counter is asking for the next person in line to come place their order.",
        options: [{
            text: "Go up to the counter and talk to the depressed-looking cashier.",
            nextState: "e12",
        }, {
            text: "Talk to the nutcracker and see what he wants.",
            nextState: "e13",

        }]
    },
    e2: {
        text: "You get there. It's just an ordinary dumpster.",
        options: [{
            text: "Not sure what you expected. Time to go into the cookies shop.",
            nextState: "e1",
        }, {
            text: "Root around in the dumpster for clues (gross).",
            nextState: "e3",
        }]
    },
    e3: {
        text: "You decide to be extra thorough and root around in the trash hole. Tyler is long gone by now, probably in the Cookie Palace which is obviously a much nicer place to be and way more likely to lead to finding Pep or at least progressing the story further. But anyway, here you are in the dumpster, rooting around like a little piggy.",
        options: [{
            text: "Ok that was silly, let's go back into the cookie thing and hopefully they don't kick me out for being a smelly boy.",
            nextState: "e1",
        }, {
            text: "Nothing is too gross if it might help save Pep! Keep digging in there until you find something.",
            nextState: "e4",
        }]
    },
    e4: {
        text: "You keep digging, only getting smellier and smellier.",
        options: [{
            text: "That's enough, let's go back to cookie land or whatever.",
            nextState: "e1",
        }, {
            text: "WE GOTTA DIG DEEPER!",
            nextState: "e5",
        }]
    },
    e5: {
        text: "Ok. You dig deeper. Good job, congratulations.",
        options: [{
            text: "Seriously, this isn't going to get you anywhere.",
            nextState: "e1",
        }, {
            text: "DEEPER DEEPER!",
            nextState: "e6",
        }]
    },
    e6: {
        text: "You keep digging for some reason.",
        options: [{
            text: "Ok go any further and they probably will just have security kick you out. Time to stop.",
            nextState: "e1",
        }, {
            text: "DIG DIG DIG",
            nextState: "e7",
        }]
    },
    e7: {
        text: "Last chance, seriously.",
        options: [{
            text: "Stop digging and turn around",
            nextState: "e1",
        }, {
            text: "DIG DIG DIG",
            nextState: "e8",
        }]
    },
    e8: {
        text: "...",
        options: [{
            text: "DIG DIG DIG",
            nextState: "e9",
        }]
    },
    e9: {
        text: "...",
        options: [{
            text: "DIG DIG DIG",
            nextState: "e9b",
        }]
    },
    e9b: {
        text: "...",
        options: [{
            text: "DIG DIG DIG",
            nextState: "e10",
        }]
    },
    e10: {
        text: "OMG wait what's that?",
        options: [{
            text: "DIG DIG DIG DIG DIG DIG",
            nextState: "e11",
        }]
    },
    e11: {
        text: "You found a dumpster gnome! He says he actually saw Pep. She went to the Cookie Palace and got some cookies, but then she left pretty quick and headed for the Bed Bath & Beyond across town.\n\n...\n\nDigging around in the dumpster really paid off, huh?",
        options: [{
            text: "Off to the store! Go grab Tyler from the much nicer and less smelly cookie shop where it would have been way easier to find out where Pep went.",
            nextState: "f0",
        }]
    },
    e12: {
        text: "You walk up to the counter and see the cashier / cookie barista. This man seriously looks like he is so over it. \"Welcome to Cookie Palace what do you want.\"",
        options: [{
            text: "I'll take a PB&J cookie, please.",
            nextState: "e14",
        }, {
            text: "How about the lemondrop one?",
            nextState: "e15",
        }, {
            text: "Can I get uhhhhhhhhhhhhhhhh peppermint espresso?",
            nextState: "e16",
        }, {
            text: "Have you seen my dog? I'm pretty sure she came in here earlier today.",
            nextState: "e17",
        }]
    },
    e13: {
        text: "\"Hello Mr. Nutcracker! Thanks for waving at us, do you know where Peperogi went?\"\nThe Nutcracker doesn't seem to be able to speak, but he hands you a walnut. You place it in his mouth and pull his lever ;) The nut is cracked wide open revealing a note.\n\"Try our new special flavors!\"",
        options: [{
            text: "Guess we gotta go buy some cookies!",
            nextState: "e12",
        }]
    },
    e14: {
        text: "You get the PB&J cookie, but it looks a bit off. You rip off a chunk and notice there is a piece of paper hidden in the middle of the cookie. But all it says on it is the word \"Bed\". The guy at the counter looks at you and just says \"Anything else?\"",
        options: [{
            text: "I'll take a PB&J cookie, please.",
            nextState: "e15p",
        }, {
            text: "Can I get uhhhhhhhhhhhhhhhh peppermint espresso?",
            nextState: "e16p",
        }]
    },
    e15: {
        text: "You get the lemondrop cookie, but it looks a bit off. You rip off a chunk and notice there is a piece of paper hidden in the middle of the cookie. But all it says on it is the word \"Bath\". The guy at the counter looks at you and just says \"Anything else?\"",
        options: [{
            text: "I'll take a PB&J cookie, please.",
            nextState: "e14l",
        }, {
            text: "Can I get uhhhhhhhhhhhhhhhh peppermint espresso?",
            nextState: "e16l",
        }]
    },
    e16: {
        text: "You get the peppermint espresso cookie, but it looks a bit off. You rip off a chunk and notice there is a piece of paper hidden in the middle of the cookie. But all it says on it is the word \"Beyond\". The guy at the counter looks at you and just says \"Anything else?\"",
        options: [{
            text: "I'll take a PB&J cookie, please.",
            nextState: "e14m",
        }, {
            text: "How about the lemondrop one?",
            nextState: "e15m",
        }]
    },

    e15p: {
        text: "You get the lemondrop cookie and check to see if there is a piece of paper. Ther is! It says \"Bath\". The guy at the counter looks at you again. \"Anything else?\"",
        options: [{
            text: "Can I get uhhhhhhhhhhhhhhhh peppermint espresso?",
            nextState: "e16pl",
        }]
    },
    e16p: {
        text: "You get the peppermint cookie and check to see if there is a piece of paper. There is! It says \"Beyond\". The guy at the counter looks at you again. \"Anything else?\"",
        options: [{
            text: "How about the lemondrop one?",
            nextState: "e15pm",
        }]
    },

    e14l: {
        text: "You get the PB&J cookie and check to see if there is a piece of paper. There is! It says \"Bed\". The guy at the counter looks at you again. \"Anything else?\"",
        options: [{
            text: "Can I get uhhhhhhhhhhhhhhhh peppermint espresso?",
            nextState: "e16pl",
        }]
    },
    e16l: {
        text: "You get the peppermint cookie and check to see if there is a piece of paper. There is! It says \"Beyond\". The guy at the counter looks at you again. \"Anything else?\"",
        options: [{
            text: "I'll take a PB&J cookie, please.",
            nextState: "e14lm",
        }]
    },

    e14m: {
        text: "You get the PB&J cookie and check to see if there is a piece of paper. There is! It says \"Bed\". The guy at the counter looks at you again. \"Anything else?\"",
        options: [{
            text: "How about the lemondrop one?",
            nextState: "e15pm",
        }]
    },
    e15m: {
        text: "You get the lemondrop cookie and check to see if there is a piece of paper. There is! It says \"Bath\". The guy at the counter looks at you again. \"Anything else?\"",
        options: [{
            text: "I'll take a PB&J cookie, please.",
            nextState: "e14lm",
        }]
    },

    e14lm: {
        text: "You get the PB&J cookie and immediately go for the piece of paper. It says \"Bed\". The guy at the counter gives you a little wink ;)",
        options: [{
            text: "Ok you could have just said she went to Bed Bath and Beyond but whatever.",
            nextState: "f1",
        }]
    },
    e15pm: {
        text: "You get the lemondrop cookie and immediately go for the piece of paper. It says \"Bath\". The guy at the counter gives you a little wink ;)",
        options: [{
            text: "Ok you could have just said she went to Bed Bath and Beyond but whatever.",
            nextState: "f1",
        }]
    },
    e16pl: {
        text: "You get the peppermint cookie and immediately go for the piece of paper. It says \"Beyond\". The guy at the counter gives you a little wink ;)",
        options: [{
            text: "Ok you could have just said she went to Bed Bath and Beyond but whatever.",
            nextState: "f1",
        }]
    },
    e17: {
        text: "\"Oh so you wanna find your cute little Pepperoni dog huh?\" The guy gives you the first smile you have seen on his face in all your years getting cookies here. \"Well, maybe she came in and maybe she didn't. Can't recall, exactly. Maybe if you bought some cookies, it would jog my memory.\"",
        options: [{
            text: "I'll take a PB&J cookie, please.",
            nextState: "e14",
        }, {
            text: "How about the lemondrop one?",
            nextState: "e15",
        }, {
            text: "Can I get uhhhhhhhhhhhhhhhh peppermint espresso?",
            nextState: "e16",
        }, {
            text: "This guy is trying to extort you! Give him a smack upside the head so he knows you mean business.",
            nextState: "e18"
        }]
    },
    e17: {
        text: "\"I'll teach you to keep my Pep from me!\" And then you smack him right in the face. He starts crying and calls over security (the nutcracker). You don't wanna get your nuts cracked so you figure you better skee-daddle. Maybe the dumpster has a clue?",
        options: [{
            text: "Guess it's time to go dumpster diving...",
            nextState: "e18",
        }]
    },
    e17: {
        text: "You head out to the dumpster and start digging. It's actually kinda fun. Tyler thinks it's weird how much fun you're having. He goes back inide to try and reconcile with the nutcracker.",
        options: [{
            text: "YEAH DUMPSTER DIVING! DIG DIG DIG!",
            nextState: "e8",
        }]
    },
    f0: {
        text: "You bust into the Cookie Palace and grab Tyler by the arm \"Pep is at the Bed Bath and Beyond Tyler! The gnome said so!\"\n\"What the hell are you on about?\"\n\"The gnome, Tyler, the gnome!\"\nAnd then you run off and Tyler follows close behind. Luckily, there is a car wash on the way, so you just run through there real quick and get squeaky clean.\nYou run so fast to Bed Bath and Beyond that you completely dry off by the time you get there.",
         options: [{
            text: "High-tail it over to Bed Bath and Beyond! You got a Pepperoni to save!",
            nextState: "f1",
        }]
    },
    f1: {
        text: "Well, all told, that was a lot harder than it needed to be but you make your way down to the Bed Bath and Beyond.",
        options: [{
            text: "Pepperoni probably headed straight for the blankies section. She might even still be holed up in there",
            nextState: "f2",
        }, {
            text: "Maybe ask an employee if they have seen Pep come in?",
            nextState: "f3",
        }, {
            text: "They certainly have security cameras around here. Break into the back rooms and got those tapes.",
            nextState: "f4",
        }]
    },
    f2: {
        text: "You make your way to the Bed portion of BB&B. Unfortunately there are a million blankies and Pep could be burrowed in any one of them.",
        options: [{
            text: "On second thought, asking that employee seems like a good idea",
            nextState: "f3",
        }, {
            text: "Welp, time to commit a crime. Let's find that secret security room.",
            nextState: "f4",
        }, {
            text: "Think of a clever way to find Pep in the bedding.",
            nextState: "f5",
        }]
    },
    f3: {
        text: "You wander around the store for a bit until you run into a little old lady in a Bed Bath and Beyond outfit. You go up to her.",
        options: [{
            text: "\"Excuse me Mrs. Old Lady, I need to find my Pepperoni dog, she has been giving us the runaround all day!\"",
            nextState: "f7",
        }, {
            text: "Whip out a picture of Pep and just show it to her and let her see your sad eyes.",
            nextState: "f7",
        }]
    },
    f4: {
        text: "You sneak around all sneaky like. Real ninja style. Eventually you find a locked door. Luckily, Tyler is an extremely hot and multi-talented individual and can pick the lock no problem. He can also hack into the mainframe and get the security footage up on the big screen.\n You see a Pepperoni dog waddle in and buy a whole crapload of blankies and pillows. Only God knows where she got that money from. Anyway she is talking to some little old lady who works at the store. Maybe she can tell us more?",
        options: [{
            text: "Go find that old lady and see what she knows",
            nextState: "f3",
        }, {
            text: "Nah who needs that old lady, let's just tear the store upside down",
            nextState: "f6",
        }]
    },
    f5: {
        text: "You call out to Pepperoni, offering all manner of treats, and toys, and Baydas. You make kissy noises and everything, but she just doesn't wanna come out. Maybe she isn't here after all.",
        options: [{
            text: "Turn the store upside down looking for her.",
            nextState: "f6",
        }]
    },
    f6: {
        text: "You start tearing into all the blankies and sheets looking for Pep. Eventually, someone comes by to talk to you.\n\"Hey there, it looks like you're having some trouble finding what you're looking for. Can I help you?\"",
        options: [{
            text: "\"I'm looking for my sweet little lost Pepperoni dog have you seen her?\"",
            nextState: "f7",
        }, {
            text: "\"My Pepperoni dog is missing! Can you help me tear up this entire store to look for her?\"",
            nextState: "f7",
        }]
    },
    f7: {
        text: "\"Ohh, you poor thing. You must be going crazy looking for that little Pep! But it's your lucky day. I actually just rang her up earlier today, she bought a whole bunch of blankies and pillow. She said something about Molly Moon. Do you know who that is?\"",
        options: [{
            text: "\"Not a who! A where! Thanks, I know exactly where she went!\"",
            nextState: "g1",
        }]
    },

    g1: {
        text: "You run run run and get to Molly Moon just in time to see them locking up for the day.",
        options: [{
            text: "Ask why they are closing up so early",
            nextState: "g2",
        }, {
            text: "Just straight up ask about Pepperoni",
            nextState: "g3",
        }, {
            text: "Sneak inside while their back is turned",
            nextState: "g4",
        }]
    },
    g2: {
        text: "\"Excuse me Molly Moon scooper person, why are you closing up shop? Did you sell out or something\"\nThe Molly Moon scooper person lets out a massive sigh. \"Yeah, some little Pepperoni dog came in and ordered the world's largest pup cup. We ran totally out of whipped cream after that, so we gotta close until we get our new shipment in tomorrow.\"",
        options: [{
            text: "Ask about which way Pep went",
            nextState: "g3",
        }, {
            text: "Look around for a trail of pup cup, she must have dropped some.",
            nextState: "g5",
        }]
    },
    g3: {
        text: "\"Hey so where is my little Pepperoni dog?\"\n\"Oh like where did she go? I'm not sure but she did say something about how she finally had everything she needed and was excited to go back home to see her favorite people in the whole wide world. Whoever those are\"",
        options: [{
            text: "Pep is home! Good thing we're just around the corner",
            nextState: "g6",
        }]
    },
    g4: {
        text: "You try to slip past the person locking up the shop, but obviously they notice you and just kinda stare you down. Mostly out of shock that someone would actually try to do that because like why.",
        options: [{
            text: "Try to save face like you are just curious about the shop",
            nextState: "g2",
        }, {
            text: "Pivot and just ask about Pep",
            nextState: "g3",
        }]
    },
    g5: {
        text: "You look around and see a bunch of gloops of pup cup making a bit of a trail. It's hard to see where they are exactly, since they blend in so well with the snow. But you manage well enough and eventually realize it leads back home!",
        options: [{
            text: "Pep is home! Good thing we're just around the corner",
            nextState: "g6",
        }]
    },
    g6: {
        text: "You run back home as fast as you can. Tyler is huffing and puffing after all the running we've been doing all morning. Plus he hasn't had any water or nothin. Big mistake. You run up the stairs as fast as you can -- no time to wait for the elevator!",
        options: [{
            text: "Bust through the door to see your little baby Pep!",
            nextState: "final",
        }]
    },
    final: {
        text: "You open the door and see a Christmas miracle! There is a blankie fort set up in the middle of the living room, a plate full to the brim with tons of tasty-looking Christmas cookies, and, of course, a giant honkin pup cup with two spoons in it!",
        options: [{
            text: "Continue...",
            nextState: "final2",
        }]
    },
    final2: {
        text: "Pepperoni comes out from the blankie fort with her tail waggling harder and faster than you've ever seen it waggle before! She missed you so much! And she did all of this so she could have the perfect Christmas morning with her two favorites.\nTyler has an extremely confused and dumbfounded look on his face.\"What the fuck is going on how did she even do any of this? Am I going crazy right now? Is this a dream??\"\nYou put your finger to his lips\"Shhh... It's a Christmas miracle!\"",
        options: [{
            text: "Continue...",
            nextState: "final3",
        }]
    },
    final3: {
        text: "And a miracle it indeed was! Everyone got all cuddled up and ate yummmy cookies and pup cups. Bella came over and snuggled right up too! Even Bodhi came over and decided to play nice with everyone just for the one day. Smolboi grumbled over and sat nearby, brooding and trying his best to look disgusted about all the Christmas cheer. But we all know he secretly loves hanging out with the family.",
        options: [{
            text: "Continue...",
            nextState: "final4",
        }]
    },
    final4: {
        text: "Just when everything seemed so perfect...\n\n\n\n\nPepperoni licked Tyler right in the goddamn mouth hole!",
        options: [{
            text: "Continue...",
            nextState: "replay",
        }]
    },
    replay: {
        text: "And they all lived happily ever after <3 The end.",
        options: [{
            text: "Or is it?",
            nextState: "initial",
        }]
    }
    
}

async function getDataForPage(params) {
    let state = "initial";
    if (JSON.stringify(params) !== "{}") {
        state = params.state;
    }

    return {
        state: states[state]
    }
}

module.exports = {
    getDataForPage,
};