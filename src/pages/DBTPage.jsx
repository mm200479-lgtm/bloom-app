import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, Shield, Users, Eye } from 'lucide-react';
import './DBTPage.css';

const SECTIONS = [
  {
    title: 'Distress Tolerance',
    icon: Shield,
    emoji: '🛡️',
    description: 'Skills for surviving crisis moments without making things worse',
    skills: [
      {
        name: 'TIPP Skills',
        content: [
          { label: 'Temperature', text: 'Hold ice cubes, splash cold water on your face, or take a cold shower. Cold activates your dive reflex and calms your nervous system fast.' },
          { label: 'Intense Exercise', text: 'Do jumping jacks, run in place, or do push-ups for 5-10 minutes. Burn off the adrenaline your body is producing.' },
          { label: 'Paced Breathing', text: 'Breathe in for 4 counts, out for 6-8 counts. Making your exhale longer than your inhale tells your body it\'s safe.' },
          { label: 'Progressive Relaxation', text: 'Tense each muscle group for 5 seconds, then release. Start from your toes and work up to your head.' },
        ]
      },
      {
        name: 'STOP Skill',
        content: [
          { label: 'Stop', text: 'Freeze. Don\'t react. Don\'t move.' },
          { label: 'Take a step back', text: 'Take a breath. Don\'t act on impulse.' },
          { label: 'Observe', text: 'Notice what\'s happening inside and outside you.' },
          { label: 'Proceed mindfully', text: 'Ask: what will help right now? Act with awareness.' },
        ]
      },
      {
        name: 'Pros and Cons',
        content: [
          { label: 'How to use', text: 'Make a list: What are the pros and cons of acting on this urge? What are the pros and cons of NOT acting on it? This helps your wise mind make the decision, not your emotional mind.' },
        ]
      },
      {
        name: 'Self-Soothe with 5 Senses',
        content: [
          { label: 'See', text: 'Look at something beautiful — nature, art, photos of people you love.' },
          { label: 'Hear', text: 'Listen to calming music, nature sounds, or a comforting voice.' },
          { label: 'Touch', text: 'Hold something soft, take a warm bath, pet an animal.' },
          { label: 'Smell', text: 'Light a candle, smell essential oils, fresh coffee, or flowers.' },
          { label: 'Taste', text: 'Sip tea, eat something with strong flavor like a mint or sour candy.' },
        ]
      },
    ]
  },
  {
    title: 'Emotion Regulation',
    icon: Brain,
    emoji: '🧠',
    description: 'Skills for understanding and managing intense emotions',
    skills: [
      {
        name: 'Opposite Action',
        content: [
          { label: 'What it is', text: 'When your emotion is telling you to do something unhelpful, do the opposite. If anxiety says "avoid," approach. If anger says "attack," gently avoid. If sadness says "isolate," reach out.' },
          { label: 'When to use it', text: 'Use opposite action when your emotion doesn\'t fit the facts, or when acting on the emotion would make things worse.' },
          { label: 'How to do it', text: 'Name the emotion → identify the action urge → check if acting on it helps → if not, do the opposite ALL THE WAY (body language, voice, actions).' },
        ]
      },
      {
        name: 'Check the Facts',
        content: [
          { label: 'Step 1', text: 'What event triggered my emotion? Describe just the facts, like a camera would see.' },
          { label: 'Step 2', text: 'What am I interpreting or assuming? Are there other possible explanations?' },
          { label: 'Step 3', text: 'Am I assuming the worst? What\'s the most likely outcome?' },
          { label: 'Step 4', text: 'Does my emotion and its intensity match the actual facts?' },
        ]
      },
      {
        name: 'ABC PLEASE',
        content: [
          { label: 'Accumulate positives', text: 'Do one pleasant thing each day, even small.' },
          { label: 'Build mastery', text: 'Do something that makes you feel competent and capable.' },
          { label: 'Cope ahead', text: 'Plan how you\'ll handle difficult situations before they happen.' },
          { label: 'PLEASE', text: 'Treat PhysicaL illness, balance Eating, avoid mood-Altering substances, balance Sleep, get Exercise.' },
        ]
      },
    ]
  },
  {
    title: 'Interpersonal Effectiveness',
    icon: Users,
    emoji: '🤝',
    description: 'Skills for communicating needs and maintaining relationships',
    skills: [
      {
        name: 'DEAR MAN',
        content: [
          { label: 'Describe', text: 'Describe the situation using facts. "When you cancel plans last minute..."' },
          { label: 'Express', text: 'Express how you feel using "I" statements. "I feel hurt and unimportant."' },
          { label: 'Assert', text: 'Ask clearly for what you want. "I\'d like you to let me know at least a day ahead."' },
          { label: 'Reinforce', text: 'Explain the positive outcome. "It would help me trust our plans and feel more secure."' },
          { label: 'Mindful', text: 'Stay focused on your goal. Don\'t get sidetracked by other issues.' },
          { label: 'Appear confident', text: 'Use a steady voice, make eye contact, stand/sit up straight.' },
          { label: 'Negotiate', text: 'Be willing to give to get. Ask "What can we do to make this work?"' },
        ]
      },
      {
        name: 'GIVE Skills (for relationships)',
        content: [
          { label: 'Gentle', text: 'No attacks, threats, or judging. Be kind even when you\'re upset.' },
          { label: 'Interested', text: 'Listen. Don\'t interrupt. Show you care about their perspective.' },
          { label: 'Validate', text: 'Acknowledge their feelings even if you disagree. "I can see why you\'d feel that way."' },
          { label: 'Easy manner', text: 'Use humor when appropriate. Be light. Smile.' },
        ]
      },
      {
        name: 'FAST Skills (for self-respect)',
        content: [
          { label: 'Fair', text: 'Be fair to yourself AND the other person.' },
          { label: 'Apologies (no unnecessary)', text: 'Don\'t over-apologize. Don\'t apologize for having needs.' },
          { label: 'Stick to values', text: 'Don\'t compromise your values to please someone.' },
          { label: 'Truthful', text: 'Don\'t lie or exaggerate. Be honest about what you need.' },
        ]
      },
    ]
  },
  {
    title: 'Mindfulness',
    icon: Eye,
    emoji: '🧘',
    description: 'Skills for being present and aware without judgment',
    skills: [
      {
        name: 'Wise Mind',
        content: [
          { label: 'What it is', text: 'The overlap between your emotional mind (feelings) and reasonable mind (logic). Wise mind is your inner knowing — the calm voice underneath the noise.' },
          { label: 'How to find it', text: 'Place your hand on your stomach. Breathe slowly. Ask yourself: "What does my wise mind say about this?" Wait for the answer. It\'s usually quieter than the other voices.' },
        ]
      },
      {
        name: 'Observe, Describe, Participate',
        content: [
          { label: 'Observe', text: 'Notice what\'s happening without trying to change it. Just watch your thoughts like clouds passing.' },
          { label: 'Describe', text: 'Put words to what you observe. "I\'m noticing tension in my shoulders. I\'m having the thought that..."' },
          { label: 'Participate', text: 'Throw yourself fully into the current moment. Be 100% in what you\'re doing right now.' },
        ]
      },
      {
        name: 'Non-Judgmental Stance',
        content: [
          { label: 'Practice', text: 'Replace judgments with facts. Instead of "this is terrible," try "this is hard right now." Instead of "I\'m so stupid," try "I made a mistake and I can learn from it."' },
          { label: 'Notice judgments', text: 'When you catch yourself judging, just notice it. "There\'s a judgment." Don\'t judge yourself for judging — that\'s a judgment too!' },
        ]
      },
    ]
  },
];

function DBTPage() {
  const [openSection, setOpenSection] = useState(null);
  const [openSkill, setOpenSkill] = useState(null);

  const toggleSection = (i) => setOpenSection(openSection === i ? null : i);
  const toggleSkill = (key) => setOpenSkill(openSkill === key ? null : key);

  return (
    <div className="dbt-page">
      <header className="page-header">
        <h1>DBT Skills 🧠</h1>
        <p className="page-subtitle">Real tools for real tough moments — you've got this</p>
      </header>

      <div className="dbt-sections">
        {SECTIONS.map((section, si) => {
          const Icon = section.icon;
          const isOpen = openSection === si;
          return (
            <div key={si} className={`dbt-section ${isOpen ? 'open' : ''}`}>
              <button className="dbt-section-header" onClick={() => toggleSection(si)}>
                <div className="section-header-left">
                  <span className="section-emoji">{section.emoji}</span>
                  <div>
                    <span className="section-name">{section.title}</span>
                    <span className="section-desc">{section.description}</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {isOpen && (
                <div className="dbt-skills slide-up">
                  {section.skills.map((skill, ski) => {
                    const skillKey = `${si}-${ski}`;
                    const skillOpen = openSkill === skillKey;
                    return (
                      <div key={ski} className="dbt-skill-card">
                        <button className="skill-header" onClick={() => toggleSkill(skillKey)}>
                          <span className="skill-name">{skill.name}</span>
                          {skillOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {skillOpen && (
                          <div className="skill-content fade-in">
                            {skill.content.map((item, ii) => (
                              <div key={ii} className="skill-step">
                                <span className="step-label">{item.label}</span>
                                <p className="step-text">{item.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="dbt-footer">
        💡 These skills come from Dialectical Behavior Therapy. They take practice — be patient with yourself as you learn them.
      </p>
    </div>
  );
}

export default DBTPage;
