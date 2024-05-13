// Initialize jsPsych
const jsPsych = initJsPsych({
    fullscreen: true,
    on_finish: function() {
        jsPsych.data.displayData();
        jsPsych.data.get().csv();
    }
});

let imageUrls = [];

async function preloadImages() {
    for (let i = 0; i < stimuli_variables.length; i++) {
        let canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 100;
        let ctx = canvas.getContext('2d');
        let preview = stimuli_variables[i].Preview;
        let letterSpacing = stimuli_variables[i].LetterSpacing * 100;

        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        let xPosition = canvas.width / 2;
        let yPosition = canvas.height / 2;

        function fillTextWithSpacing(text, x, y, spacing) {
            let characters = text.split('');
            let currentPosition = x - (ctx.measureText(text).width / 2);
            characters.forEach(char => {
                ctx.fillText(char, currentPosition, y);
                currentPosition += ctx.measureText(char).width + spacing;
            });
        }

        fillTextWithSpacing(preview, xPosition, yPosition, letterSpacing);
        imageUrls.push(canvas.toDataURL('image/png'));
    }
    return imageUrls; // Ensure this is returned so that it can be used in then()
}

// Ensuring the images are preloaded before starting the experiment
preloadImages().then((loadedImages) => {
    console.log("All images have been preloaded.");

    const experimentTimeline = {
        timeline: [/* your experiment timeline components here */]
    };

    // Start the experiment
    jsPsych.run(experimentTimeline);
});


/* //initialize jspsych
const jsPsych = initJsPsych({
    fullscreen: true,
    //display data at the end of the experiment
    on_finish: function() {
        jsPsych.data.displayData();
        jsPsych.data.get().csv();
    }
}); */

// Define the total number of stimuli
const totalStimuli = stimuli_variables.length;
const numRandomTrials = 40;
const practiceStimuli = jsPsych.randomization.sampleWithoutReplacement(stimuli_variables, numRandomTrials);
const experimentStimuli = stimuli_variables.filter(stimulus => !practiceStimuli.includes(stimulus));

//create timeline
var timeline = [];


/* Stores info received by Pavlovia */
var pavloviaInfo;

/* init connection with pavlovia.org */
var pavlovia_init = {
  type: jsPsychPavlovia,
  command: "init",
  // Store info received by Pavlovia init into the global variable `pavloviaInfo`
  setPavloviaInfo: function (info) {
    console.log(info);
    pavloviaInfo = info;
  }
};
timeline.push(pavlovia_init);


//enter fullscreen mode

var enter_fullscreen = {
    type: jsPsychFullscreen,
    stimulus: 'This trial launch in fullscreen mode when you click the button below.',
    choices: ['Continue']
  }
  timeline.push(enter_fullscreen);

var trial = {
    type: jsPsychVirtualChinrest,
    blindspot_reps: 3,
    resize_units: "none"
};

const randomCode = generateRandomCode(5); // Change to the desired code length

// Add the random code to the subject ID
var subject_id = randomCode;
// This adds a property called 'subject' and a property called 'condition' to every trial
jsPsych.data.addProperties({
  subject: subject_id,
});

// Function to generate a random completion code
function generateRandomCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

/*  var welcome = {
    timeline: [
       
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus:
                "<h2>Welcome to the experiment.</h2>" +
                "<p>" +
                "This experiment should take roughly 30 minutes to complete." +
                "</p>" +
                "<p>" +
                "First, you will fill out a short questionnaire. After the " +
                "questionnaire, we will assess your reading level in Arabic." +
                "</p>" +
                "<p>" +
                "Following this, you will be ready to begin the experiment." +
                "</p>" +
                "<p>" +
                "Press any key to continue." +
                "</p>",
            post_trial_gap: 500 // Add a gap after the welcome screen (in milliseconds)
        },
        {
            type: jsPsychSurveyText,
            questions: [
                { prompt: 'What is your age?', name: 'age', placeholder: '21' },
                { prompt: 'What is your present country of residence?', name: 'country', placeholder: 'United Arab Emirates'}
            ]
        }
    ]
};


timeline.push(welcome);

var consent = {
    timeline: [
        {
            type: jsPsychHtmlButtonResponse,
            stimulus: consent_trial,
            choices: ['Yes', 'No'],
            required: true,
            post_trial_gap: 500, // Adjust as needed
        }
    ],
    timeline_variables: consent_trial, // Assuming consent_trial contains the 'sentence' property
};

timeline.push(consent);



var demographics = {
  timeline: [
    { 
      type: jsPsychSurveyMultiChoice,
      questions: [
        {
          prompt: "What is your biological sex?", 
          name: 'BiologicalSex', 
          options: ['Male', 'Female', 'Other'], 
          required: true
        }, 
        {
          prompt: "Do you have dyslexia?",
          name: 'Dyslexia',
          options: ['Yes', 'No'],
          required: true
        },
        {
            prompt: "Do you wear corrective lenses?",
            name: 'Lens',
            options: ['Yes, eyeglasses', 'Yes, contact lenses', 'No', 'Unsure'],
            required: true
          },
        {
          prompt: "Which is your dominant hand?", 
          name: 'DomHand', 
          options: ['Left', 'Right'], 
          required: true
        },
        {
          prompt: "Were you born and raised in a multilingual environment?",
          name: 'MultEnv',
          options: ['Yes', 'No'],
          required: false
        },
        {
          prompt: "Is Arabic your first language?",
          name: 'ArabFirst',
          options: ['Yes', 'No'],
          required: true
        },
        {
          prompt: "Which dialect of Arabic is your native dialect?",
          name: 'ArabicDialect',
          options: ['Egyptian', 'Levantine (Palestine, Syria, Lebanon, Jordan)', 'Iraqi', 'North African (Morocco, Algeria, Tunisia, Libya)', 'Sudanese', 'Gulf/Khaliji (UAE, Saudi Arabia, Kuwait, Bahrain, Qatar, Oman, Yemen)', 'Other'],
          required: true
        },
        {
          prompt: "On a scale from 0% to 100%, where 0% means you never use Arabic in your daily life, and 100% means you speak Arabic exclusively, how would you rate the frequency with which you <b>speak Arabic</b> in your day-to-day activities?",
          name: 'SpeakinArabic',
          options: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
          required: true
        },
        {
          prompt: "On a scale from 0% to 100%, where 0% means you never read Arabic in your daily life, and 100% means you read in Arabic exclusively, how would you rate the frequency with which you <b>read in Arabic</b> in your day-to-day activities?",
          name: 'ReadinArabic',
          options: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
          required: true
        },
        {
          prompt: "On a scale from 0% to 100%, where 0% means you never write in Arabic in your daily life, and 100% means you write Arabic exclusively, how would you rate the frequency with which you <b>write in Arabic</b> in your day-to-day activities?",
          name: 'WriteinArabic',
          options: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
          required: true
        },

      ],
    }
  ]
};
timeline.push(demographics);

var instruction_screen_practice = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>" +
        "You are now going to see Arabic sentences on the screen, one after " +
        "the other. Each sentence is broken up into words. You can " +
        "reveal the sentence word-by-word by <b>repeatedly hitting " +
        "the spacebar.</b> " +
        "After reading, you will see a question. You will have " +
        "to indicate whether the statement is correct or not. " +
        "It is important that you really <i>read</i> " +
        "each sentence." +
        "</p>" +
        "<p>" +
        "<i>Press any key when ready to start.</i>" +
        "</p>",
    response_ends_trial: true,
    on_finish: function (data) {
        data.rt = Math.round(data.rt);
    }
};

timeline.push(instruction_screen_practice);


  //define instructions & add 2 second gap afterwards
        var instructions = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
            <p><b>Instructions:</b></p>
            <p>Each trial will start with a group of hash marks (######) followed by a word that will appear briefly in the center of the screen.</p>
            <p>Your task is to quickly determine the <strong>position</strong> where the word is printed.</p>
            <p>Press <kbd>A</kbd> if the word is on the left. </p>
            <p>Press <kbd>L</kbd> if the word is on the right.</p>
            <p>React as fast as you can! Press any key to start the practice round.</p>
              `,
            post_trial_gap: 2000,
        };
        timeline.push(instructions); */

  //define fixation
 var fixation = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<div style="position: absolute; bottom: 500px; text-align: center; left: 50%; transform: translateX(-50%);color: red;font-size:60px;">+</div>',
            choices: 'NO_KEYS',
            trial_duration: 500,
            task: 'fixation',
        };
        
//define trial stimuli array for timeline variables 
       

var test = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let imageIndex = jsPsych.timelineVariable('imageIndex');
        return `<img src="${imageUrls[imageIndex]}" style="display: block; margin: auto;">`;
    },
    choices: ["a", "l"],
    trial_duration: 2000,
    timeline_variables: stimuli_variables.map((item, index) => ({ ...item, imageIndex: index })),
    randomize_order: true
};







 
 
// Define the backward mask (same as the forward mask)
var backwards_mask = {
    type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div style="position: absolute; bottom: 500px; text-align: center; left: 50%; transform: translateX(-50%); font-size:60px;">+</div>',
      trial_duration: 200, // Immediate display
         };

 var response_trial = {
     type: jsPsychHtmlKeyboardResponse,
     stimulus: '<div style="position: absolute; bottom: 500px; text-align: center; left: 50%; transform: translateX(-50%);font-size:60px;">+</div>' +
         '<p>Do you know this word?</p>',
      choices: ["a", "l"],
      trial_duration: 2000,
      data: {
        task: 'response',
        position: jsPsych.timelineVariable('Position'),
        preview: jsPsych.timelineVariable('Preview'),
        correct_response: jsPsych.timelineVariable('Type'),
        nonjoiningletters:  jsPsych.timelineVariable('NonjoiningLetters'),
        nonjoiningmiddle: jsPsych.timelineVariable('NonjoiningMiddle'),
        //letter_spacing: jsPsych.timelineVariable('LetterSpacing'),
        trial_num:jsPsych.timelineVariable('Trial')
      },
      on_finish: function (data) {
        var correctResponse = data.correct_response;
        var responseKey = data.response;

        // Check if the participant's response key matches the target position
        data.correct = (correctResponse === "Nonword" || correctResponse === "Mirror" || correctResponse === "Pseudoword" && responseKey === 'l') ||
                       (correctResponse === 'Word' && correctResponse === 'a');
    },
};

var feedback = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 1000,
  stimulus: function(){
    // Check if the response is null
    var last_trial_response = jsPsych.data.get().last(1).values()[0].response;
    // Check the accuracy of the last response
    var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
  }
}
       
// Debrief block
var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        // Get all trials with a "response" task
        var trials = jsPsych.data.get().filter({ task: 'response' });

        // Calculate accuracy by comparing participants' responses with the correct responses
        var correct_responses = trials.select('correct_response');
        var participant_responses = trials.select('response');
        var correct_count = 0;

        for (var i = 0; i < trials.count(); i++) {
            var correct = trials.select('correct').values[i];

            // Check if the participant's response was correct
            if (correct) {
                correct_count++;
            }
        }

        var accuracy = Math.round((correct_count / trials.count()) * 100);

        // Calculate average response time for all trials
        var rt = Math.round(trials.select('rt').mean());

        return `<p>You responded correctly on ${accuracy}% of the trials.</p>
        <p>Your average response time was ${rt}ms.</p>
        <p>Press any key to complete the experiment. Thank you!!</p>`;
    }
};
timeline.push(debrief_block);

// Debrief block after the practice block
var practice_debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        // Get all trials with a "response" task from the practice block
        var practice_trials = jsPsych.data.get().filter({ task: 'response' }); // Adjust the timeline index if needed

        // Calculate accuracy by comparing participants' responses with the correct responses
        var practice_correct_responses = practice_trials.select('correct_response');
        var participant_responses = practice_trials.select('response');
        var correct_count = 0;

        for (var i = 0; i < practice_trials.count(); i++) {
            var correct = practice_trials.select('correct').values[i];
            // Check if the participant's response was correct
            if (correct) {
                correct_count++;
            }
        }

        var prac_accuracy = Math.round((correct_count / practice_trials.count()) * 100);

        // Calculate average response time for all practice trials
        var prac_rt = Math.round(practice_trials.select('rt').mean());

        return `<p>You responded correctly on ${prac_accuracy}% of the practice trials.</p>
        <p>Your average response time was ${prac_rt}ms.</p>
        <p>Press the spacebar to start the main experiment. Thank you!!</p>`;
    }
};

 // Combine the endPracticeMessage and practice_procedure in a single timeline
var practice_timeline =  {
    timeline: [fixation, test, backwards_mask, response_trial],
    timeline_variables: practiceStimuli,
    randomize_order: true,
    repetitions: 1,
};

var separatorMessage = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Now, it's time for the main experiment.</p>
        <p>You will go through a total of 6 blocks with short breaks in between.</p>
        <p>Press any key to start the main experiment.</p>`,
};

var endMessage = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<p>You're done with the experiment.</p>
        <p>Press any key to exit.</p>`,
    trial_duration: 3000,
};

var chunk_debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        // Get all trials with a "response" task from the current chunk
        var chunk_trials = jsPsych.data.get().filter({ task: 'response' }).last(100); // Adjust the timeline index if needed

        // Calculate accuracy by comparing participants' responses with the correct responses
        var chunk_correct_responses = chunk_trials.select('correct_response');
        var participant_responses = chunk_trials.select('response');
        var correct_count = 0;

        for (var i = 0; i < chunk_trials.count(); i++) {
            var correct = chunk_trials.select('correct').values[i];
            // Check if the participant's response was correct
            if (correct) {
                correct_count++;
            }
        }
        var chunk_accuracy = Math.round((correct_count / chunk_trials.count()) * 100);

        // Calculate average response time for all trials in the current chunk
        var chunk_rt = Math.round(chunk_trials.select('rt').mean());

        // Get the block number, considering the practice trials
        var block_number = (Math.ceil(jsPsych.data.get().filter({ task: 'response' }).count() / 100)-1);

        return `<p><b>Block ${block_number} accuracy:</b> ${chunk_accuracy}%.</p>
                <p><b>Average response time for the last 100 trials:</b> ${chunk_rt}ms.</p>
                <p>Press any key to continue.</p>`;
    },
};

// Create a timeline with a single trial displaying the completion code
// Create a timeline with a single trial displaying the completion code
const completionCodeTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    return `<p>Your completion code is: <b>${randomCode}</b>.</p> Please copy and enter the completion code in this survey to receive your payment. When you're done, press 'Enter' to exit.</p><a href="https://nyu.qualtrics.com/jfe/form/SV_6QdM3m1mA0YBlH0" target="_blank">Survey</a>`;
  },
  choices: ['Enter'],
  response_ends_trial: true,
  trial_duration: 60000
};

var main_procedure = {
    timeline: [
        fixation, 
        test, 
        backwards_mask, 
        response_trial,
        { 
          conditional_function: function () {
                return jsPsych.data.get().filter({ task: 'response' }).count() % 100 === 0;
            },
            timeline: [chunk_debrief_block],
        }
    ],
    timeline_variables: experimentStimuli,
    randomize_order: true,
    repetitions: 1, // Run through all  trials once
};
/* finish connection with pavlovia.org */
var pavlovia_finish = {
    type: jsPsychPavlovia,
    command: "finish",
    participantId: "JSPSYCH-DEMO",
    // Modify the dataFilter function to get CSV data
    dataFilter: function(data) {
        // Printing the data received from jsPsych.data.get().csv(); a CSV data structure
        var csvData = jsPsych.data.get().csv();
        console.log(csvData);
        
        // Return the CSV data
        return csvData;
    },
    // Thomas Pronk; call this function when we're done with the experiment and data reception has been confirmed by Pavlovia
    completedCallback: function() {
        alert('data successfully submitted!');
    }
};

timeline.push(pavlovia_finish);



// Define the full timeline
var experimentTimeline = [
enter_fullscreen,
    //instructions,
    practice_timeline,  // Include the practice timeline
    practice_debrief_block,
    separatorMessage,
    main_procedure,
    debrief_block,
    completionCodeTrial
    ];

var version = jsPsych.version();
console.log(version);

// Start the experiment
jsPsych.run(experimentTimeline);
