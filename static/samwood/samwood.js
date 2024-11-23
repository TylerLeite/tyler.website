const states = {
    initial: {
        text: "Follow some key moments in Sam Wood's story and watch his growth through the lens of how he interacts with Virgil Tibbs",
        options: [{
            text: "Begin.",
            nextState: "train",
        }]
    }, train: {
        text: "\"With his right hand once more on his side-arm, Sam pushed into the poorly lighted room and then drew a quick gulp of breath. There was someone there.\" (p. 12)",
        pages: [12],
        options: [{
            text: "That's the killer! Shoot him while you still have the chance.",
            nextState: "f1a",
        }, {
            text: "This is a prime suspect, arrest him and bring him into the police station.",
            nextState: "a",
        }, {
            text: "Call for backup, you don't know how dangerous he might be.",
            nextState: "f1c",
        }]
    }, f1a: {
        text: "That's not the proper protocol.",
        pages: [],
        options: [{
            text: "Try again.",
            nextState: "train",
        }]
    }, f1c: {
        text: "You think you can handle yourself if anything goes sour. Besides, you don't want to seem weak in front of Gillespie.",
        pages: [],
        options: [{
            text: "Try again.",
            nextState: "train",
        }]
    }, a: {
        text: "\"'Go out the door to your left', he ordered, 'There's a police car in drive. Get in the back seat and shut the door. Make one false move and I'll drop you right then with a bullet in your spine. Now move.'\" (p. 14)",
        pages: [14],
        options: [{
            text: "Continue",
            nextState: "police",
        }]
    }, police: {
        text: "\"'Is [Virgil] here?'\n'No, he's been out all day. Took that old car he's got and left. No one knows where he is.'\n'Maybe he got lonesome and found some nice black girl to shack up with him.' As soon as he had uttered those words, Sam was ashamed of himself. He wished he hadn't said them.\" (p. 69)",
        pages: [69],
        options: [{
            text: "Play it off as a joke and try to bolster Virgil's reputation.",
            nextState: "b",
        }, {
            text: "It's not that big a deal, Pete knows you're just having fun. Wait and see how he responds.",
            nextState: "f2b",
        }, {
            text: "Even though you feel bad, you don't think it's worth dwelling on. Just continue the conversation.",
            nextState: "f2c",
        }]
    }, b: {
        text: "\"Sam made amends, and was glad he could. 'I was just kiddin'. Virgil's all right. It wouldn't fool me if he came out on top of this thing.'\" (p. 70)",
        pages: [70],
        options: [{
            text: "Continue",
            nextState: "diner",
        }]
    }, f2b: {
        text: "\"'I don't know', Pete answered slowly, 'He's awful smart for a black boy. I bet he's working on the case somehow.'\" (p. 70)",
        pages: [],
        options: [{
            text: "Try again.",
            nextState: "police",
        }]
    }, f2c: {
        text: "You would feel bad all day. Maybe you should try something else.",
        pages: [],
        options: [{
            text: "Try again.",
            nextState: "police",
        }]
    }, diner: {
        text: "\"As he picked up speed, he wondered what to do with Virgil while he was at the diner; colored were not allowed inside. No clear answer had come to him by the time he pulled into the parking lot.\" (p. 82)",
        pages: [82],
        options: [{
            text: "Stop in for a few minutes and have a Coke and some pie.",
            nextState: "f3a",
        }, {
            text: "Grab some food to go and eat it in the car while Virgil watches.",
            nextState: "f3b",
        }, {
            text: "Get food for both yourself and Virgil and hand it to him in the car.",
            nextState: "c",
        }, {
            text: "Bring Virgil into the diner with you and make Ralph serve him.",
            nextState: "f3d",
        }]
    }, f3a: {
        text: "The pie just wouldn't taste right knowing you left Virgil out in the cold.",
        pages: [],
        options: [{
            text: "Try again.",
            nextState: "diner",
        }]
    }, f3b: {
        text: "You would be in the car anyway, who would know the difference if you brought something for Virgil to have while no one's looking?",
        pages: [],
        options: [{
            text: "Try again.",
            nextState: "diner",
        }]
    }, f3d: {
        text: "You don't think that's a great idea, it makes you feel a bit uneasy.",
        pages: [],
        options: [{
            text: "Try again.",
            nextState: "diner",
        }]
    }, c: {
        text: "\"Ralph's displeasure didn't phase Sam a bit; it even helped to mollify his conscience. As he passed the food to Virgil Tibbs he felt proud of himself.\" (p. 83)",
        pages: [83],
        options: [{
            text: "Continue",
            nextState: "final",
        }]
    }, final: {
        text: "Sam shows tremendous character growth over the course of the novel. He is not completely reformed by the end of the story, but he clearly comes to see Virgil Tibbs more empathetically, and even stands up for him.",
        options: [{
            text: "Play again?",
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