// -----------------------------------------------------------------------
// C&P EXAM PRACTICE SIMULATOR SCENARIOS
// -----------------------------------------------------------------------
export const CP_SIMULATOR_SCENARIOS = [
  {
    id: 'spine',
    title: 'Spine & Musculoskeletal DBQ Exam',
    examinerPrompt: '"Good morning. I see you noted back and neck pain. On a normal day, how does your back feel, and can you bend down to touch your toes for me?"',
    options: [
      {
        text: 'A) "Honestly, today is not too bad! I can bend pretty far if I warm up first, but sometimes after a long run it gets sore."',
        ratingImpact: 'DISASTER (Likely 0% - 10% or Denial)',
        feedback: 'Never describe your best or average day. When the examiner asks you to bend, VA regulations mandate that range of motion stops the moment PAIN or RESISTANCE begins, not when you physically can not move further. Minimizing your symptoms leads to severe under-rating.',
        isOptimal: false
      },
      {
        text: 'B) "On my worst days, pain radiates down my legs, making it difficult to put on shoes or sit for more than 20 minutes. As I bend, the pain begins right here at about 30 degrees of flexion, so I must stop."',
        ratingImpact: 'OPTIMAL (High 20% - 40% Rating + Secondary Radiculopathy)',
        feedback: 'Perfect execution. You accurately described functional impairment, your worst flare-ups, radiating nerve symptoms (secondary radiculopathy), and properly stopped the goniometer measurement when pain started.',
        isOptimal: true
      },
      {
        text: 'C) "It hurts all the time. 10 out of 10 pain 24/7. I can not move at all."',
        ratingImpact: 'SUSPICIOUS (Examiner may note exaggeration / lack of credibility)',
        feedback: 'Avoid exaggerating with "10/10 24/7" unless hospitalized. Focus on specific functional limitations (e.g. inability to lift groceries, sleep disturbances, flare-up frequency, and exact degrees of motion).',
        isOptimal: false
      }
    ]
  },
  {
    id: 'ptsd',
    title: 'Mental Health / PTSD DBQ Exam',
    examinerPrompt: '"How are things going with your family, sleep, and your job? Are you managing okay day to day?"',
    options: [
      {
        text: 'A) "Yeah, I am hanging in there. Work is fine and I manage to get through the day, just get a little stressed sometimes."',
        ratingImpact: 'DENIAL / LOW (0% - 10% Rating)',
        feedback: 'Military culture teaches us to say "I am fine." In a C&P exam, this destroys your claim. The VA rates mental health based on social and occupational impairment (38 CFR 4.130).',
        isOptimal: false
      },
      {
        text: 'B) "I struggle significantly. I isolate from friends, experience frequent nightmares and hypervigilance in crowds, wake up exhausted after 3 hours of sleep, and have had multiple verbal conflicts at work that resulted in disciplinary warnings."',
        ratingImpact: 'OPTIMAL (Solid 70% Rating - Occupational & Social Impairment)',
        feedback: 'Spot on. You clearly articulated specific symptoms corresponding to the 70% rating criteria: sleep impairment, panic/hypervigilance, social isolation, and occupational friction.',
        isOptimal: true
      },
      {
        text: 'C) "Everything is the military\'s fault and I hate everyone."',
        ratingImpact: 'UNHELPFUL (Lacks clinical symptom specificity)',
        feedback: 'Focus on clinical symptoms: frequency of panic attacks, mood regulation, memory lapses, sleep disruption, relationship strains, and inability to maintain social ties.',
        isOptimal: false
      }
    ]
  },
  {
    id: 'migraines',
    title: 'Migraine Headaches (DC 8100) C&P Exam',
    examinerPrompt: '"Tell me about your headaches. How often do they occur and what do you do when they strike?"',
    options: [
      {
        text: 'A) "I get them about once a week. I take some Advil and keep working through the headache."',
        ratingImpact: 'LOW (10% Rating)',
        feedback: 'If you can continue working, the VA considers the headache NON-PROSTRATING. 50% rating requires PROSTRATING attacks (attacks that force you to stop all activity and lie down in a dark, quiet room).',
        isOptimal: false
      },
      {
        text: 'B) "I experience severe throbbing headaches 2 to 3 times per month. They cause intense light sensitivity and nausea, forcing me to lay down in a dark room for 4-6 hours, missing work and completely stopping all activity."',
        ratingImpact: 'MAXIMUM RATING (50% Rating Schedule)',
        feedback: 'Excellent. You highlighted the critical legal keywords: "prostrating attacks", frequency (2+ times monthly), light/noise sensitivity, and concrete economic/work impact.',
        isOptimal: true
      }
    ]
  }
];
