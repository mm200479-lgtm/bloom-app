import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import './LearnPage.css';

const TOPICS = [
  {
    title: 'What is ADHD?',
    emoji: '🧠',
    content: `ADHD isn't about being lazy or not trying hard enough. It's a brain difference that affects how you focus, organize, and manage impulses. Your brain's "reward system" works differently — it craves stimulation and struggles with things that feel boring, even when you know they're important.

People with ADHD often have amazing creativity, energy, and the ability to hyperfocus on things they love. The tricky part is that your brain doesn't always cooperate when you need it to — like during homework or chores.

ADHD is real, it's neurological, and it's not your fault. With the right support and strategies, you can work WITH your brain instead of fighting against it.`
  },
  {
    title: 'Understanding Anxiety',
    emoji: '😰',
    content: `Anxiety is your brain's alarm system going off when it thinks there's danger — even when there isn't. It's like having a smoke detector that goes off every time you make toast. The alarm is real, but the danger usually isn't.

When you're anxious, your body goes into fight-or-flight mode: racing heart, shallow breathing, tense muscles, racing thoughts. This is your body trying to protect you. It's not weakness — it's biology.

The good news? Anxiety is one of the most treatable mental health conditions. Learning to recognize your anxiety patterns, challenge anxious thoughts, and calm your nervous system can make a huge difference. You're not "crazy" for feeling anxious — your brain is just being overprotective.`
  },
  {
    title: 'What Happens During a Flashback',
    emoji: '⚡',
    content: `A flashback is when your brain replays a traumatic memory so vividly that it feels like it's happening right now. Your body reacts as if the danger is present — racing heart, sweating, freezing up, or feeling disconnected from reality.

This happens because trauma gets stored differently in your brain. Instead of being filed away as a "past event," it stays in the part of your brain that handles immediate threats. So when something triggers that memory, your brain doesn't know the difference between then and now.

Flashbacks are not a sign of weakness. They're a sign that your brain is still processing something difficult. Grounding techniques (like the 5-4-3-2-1 method) can help bring you back to the present. With time and support, flashbacks can become less intense and less frequent.`
  },
  {
    title: 'Why Depression Lies',
    emoji: '🌧️',
    content: `Depression is like wearing dark-tinted glasses that make everything look hopeless. It tells you things like "nothing will ever get better," "nobody cares," and "you're a burden." These feel absolutely true when you're in it — but they're not facts. They're symptoms.

Depression changes your brain chemistry in ways that literally filter out positive information. You can't remember good times as easily, you can't imagine a better future, and compliments bounce right off. This isn't a character flaw — it's what the illness does.

The most important thing to know: depression lies, and it's temporary even when it doesn't feel that way. Many people recover from depression, and treatment works. If you're in it right now, try to hold onto this: the way you feel right now is not the way you'll feel forever.`
  },
  {
    title: 'Your Brain on Stress',
    emoji: '🔥',
    content: `When you're stressed, your brain releases cortisol and adrenaline — chemicals designed to help you survive danger. In small doses, stress can actually help you perform better. But when stress is constant, those chemicals start causing problems.

Chronic stress can make it harder to concentrate, sleep, and regulate emotions. It can cause headaches, stomach problems, and make you more likely to get sick. Your prefrontal cortex (the "thinking" part of your brain) goes offline, and your amygdala (the "reacting" part) takes over.

This is why you might snap at people, make impulsive decisions, or feel overwhelmed by small things when you're stressed. Your brain is literally in survival mode. The key is learning to activate your body's relaxation response — through breathing, movement, connection, and rest.`
  },
  {
    title: 'What is Dissociation?',
    emoji: '🌫️',
    content: `Dissociation is when your brain disconnects you from your thoughts, feelings, surroundings, or even your sense of identity. It can feel like you're watching yourself from outside your body, like the world isn't real, or like you're in a fog.

This is actually your brain's way of protecting you from overwhelming experiences. Think of it like an emotional circuit breaker — when things get too intense, your brain flips the switch to keep you from being flooded. It's a survival mechanism.

Mild dissociation is common (like zoning out during a boring class). But if you're dissociating frequently or for long periods, it might be connected to stress, trauma, or anxiety. Grounding techniques can help bring you back. And talking to a therapist about it is a really good idea — you deserve to feel present in your own life.`
  },
  {
    title: 'Understanding Triggers',
    emoji: '🎯',
    content: `A trigger is anything that sets off an intense emotional reaction — often connected to a past experience. It could be a sound, a smell, a phrase someone says, a place, or even a time of year. Triggers can cause anxiety, anger, sadness, or flashbacks.

Triggers aren't logical, and that's okay. Your brain made an association between something in the present and something painful from the past. It's trying to warn you of danger, even if the current situation is safe.

Understanding your triggers is powerful. When you can name what's happening ("I'm being triggered, not actually in danger"), you can respond instead of just reacting. Over time, with support, triggers can lose their power. You're not broken for having them — you're human.`
  },
];

function LearnPage({ onBack }) {
  const [openTopic, setOpenTopic] = useState(null);

  const toggle = (i) => setOpenTopic(openTopic === i ? null : i);

  return (
    <div className="learn-page">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <header className="page-header">
        <h1>Learn 📚</h1>
        <p className="page-subtitle">Understanding what's happening in your brain changes everything</p>
      </header>

      <div className="learn-topics">
        {TOPICS.map((topic, i) => (
          <div key={i} className={`learn-card ${openTopic === i ? 'open' : ''}`}>
            <button className="learn-card-header" onClick={() => toggle(i)}>
              <span className="learn-emoji">{topic.emoji}</span>
              <span className="learn-title">{topic.title}</span>
              {openTopic === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openTopic === i && (
              <div className="learn-content fade-in">
                {topic.content.split('\n\n').map((para, pi) => (
                  <p key={pi}>{para}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="learn-footer">
        💜 Knowledge is power. Understanding your brain helps you be kinder to yourself.
      </p>
    </div>
  );
}

export default LearnPage;
