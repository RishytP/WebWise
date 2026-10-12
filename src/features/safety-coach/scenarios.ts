import type { CoachScenario } from '../../types';

/**
 * Safety Coach scenarios.
 *
 * Every example is invented and safe. No real malicious URL, no real download
 * and no request for real credentials appears here — the point is to rehearse
 * the decision, not to visit anything.
 */
export const SCENARIOS: CoachScenario[] = [
  {
    id: 'suspicious-url',
    title: 'The address that looks almost right',
    intro: 'You get a link in a group chat. Before you tap it, you look at the address.',
    example: 'https://paypa1-secure-login.example.com/verify-account',
    exampleDetail: 'Notice how the address uses the number "1" instead of the letter "l".',
    question: 'What is the safest thing to do with this link?',
    answers: [
      {
        id: 'a',
        text: 'Tap it — the page will probably look official.',
        correct: false,
        feedback:
          'The address is the one part a scammer cannot fake easily. This one swaps a letter for a number and adds "secure-login", which is a classic trick. A page that looks official proves nothing.',
      },
      {
        id: 'b',
        text: 'Check the address carefully and, if unsure, go to the real site by typing its name yourself.',
        correct: true,
        feedback:
          'Exactly. Read the address slowly, especially the part just before the ending. If you want the real service, open a new tab and type the name you know — do not rely on the link you were sent.',
      },
      {
        id: 'c',
        text: 'Reply to the sender to ask if the link is real.',
        correct: false,
        feedback:
          'The sender may not be who they claim. If the account was taken over, their reply will simply say "yes". Verify through a route you choose, not through the message.',
      },
    ],
    takeaway: 'Read addresses slowly. The real owner is the part right before the ending, like .com or .co.uk.',
  },
  {
    id: 'unexpected-download',
    title: 'A file you did not ask for',
    intro: 'A website suddenly starts downloading a file you never clicked on.',
    example: 'player_setup.exe is downloading…',
    exampleDetail: 'You only wanted to watch a video. No download button was clicked.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Open it to see what it is.',
        correct: false,
        feedback:
          'A file that downloads itself is a warning sign. Files ending in .exe or .apk can install software. Opening it is the risky part — you cannot tell what it does by looking at the icon.',
      },
      {
        id: 'b',
        text: 'Close the download and the tab, then tell a trusted adult.',
        correct: true,
        feedback:
          'Right. Cancel the download, close the tab, and show an adult. If it already finished, do not open it — an adult can help you remove it safely.',
      },
      {
        id: 'c',
        text: 'Keep it but rename it so it looks safe.',
        correct: false,
        feedback:
          'Renaming a file does not change what it does. The danger is in the file itself, not its name.',
      },
    ],
    takeaway: 'You never have to open a file you did not ask for. Closing a download is always allowed.',
  },
  {
    id: 'notification-request',
    title: 'The "allow notifications" pop-up',
    intro: 'A quiz website asks to send you notifications as soon as the page loads.',
    example: 'quizfun.example wants to: Show notifications',
    exampleDetail: 'You have not even started the quiz yet.',
    question: 'What does allowing this actually mean?',
    answers: [
      {
        id: 'a',
        text: 'It just makes the quiz work better.',
        correct: false,
        feedback:
          'Quizzes work fine without notifications. Notifications let the site send messages to your device even when the tab is closed, which is far more than a quiz needs.',
      },
      {
        id: 'b',
        text: 'It lets the site send you messages later, even when it is closed. Only allow it if you actually want that.',
        correct: true,
        feedback:
          'Correct. If you do not want pop-up messages from a site, choose "Block" or just ignore the pop-up. Saying no costs you nothing here.',
      },
      {
        id: 'c',
        text: 'It tells the site your name and email address.',
        correct: false,
        feedback:
          'Notifications do not share your name or email. The point is that it is a lasting permission you can be asked to give very quickly — so it is worth pausing.',
      },
    ],
    takeaway: 'Notification requests are often asked for far too early. You can always block them.',
  },
  {
    id: 'fake-login',
    title: 'The login page that is not what it seems',
    intro: 'A game site asks you to sign in, but you are already signed in on the real site.',
    example: 'Sign in again to continue — enter your username and password',
    exampleDetail: 'The page arrived from a link, and the address is not the one you normally use.',
    question: 'What is the safest move?',
    answers: [
      {
        id: 'a',
        text: 'Type your password — you just want to keep playing.',
        correct: false,
        feedback:
          'Being asked to sign in again out of nowhere is a red flag. A fake page can look identical to the real one; the difference is where your password actually goes.',
      },
      {
        id: 'b',
        text: 'Stop. Open a new tab, type the real site’s address yourself, and sign in there if needed.',
        correct: true,
        feedback:
          'Yes. Going to the site yourself means you know exactly who receives your password. Never enter a password on a page you reached from a link you were sent.',
      },
      {
        id: 'c',
        text: 'Enter a made-up password to test it.',
        correct: false,
        feedback:
          'Testing still sends a username and reveals that you use the site. Just leave the page and reach the real site your own way.',
      },
    ],
    takeaway: 'Reach login pages by typing the address yourself. A page that looks right can still be a copy.',
  },
  {
    id: 'password-request',
    title: 'Someone asks for your code',
    intro: 'You get a message that looks like it is from a friend.',
    example: '"Hey it\'s me, I lost my phone. Send me the 6-digit code you just got so I can log back in."',
    exampleDetail: 'You did receive a code by text a moment ago.',
    question: 'What do you do?',
    answers: [
      {
        id: 'a',
        text: 'Send the code — it is your friend.',
        correct: false,
        feedback:
          'That code is the key to your account. Nobody legitimate ever needs it from you, not even a real friend. A stolen account can then message your other friends the same way.',
      },
      {
        id: 'b',
        text: 'Do not send it. Check with your friend another way and tell a trusted adult.',
        correct: true,
        feedback:
          'Exactly right. Never share passwords or verification codes. Check with the person through a different route, and let an adult know.',
      },
      {
        id: 'c',
        text: 'Send only part of the code so it is safer.',
        correct: false,
        feedback:
          'Part of a code is still useful to an attacker, and they can ask again for the rest. The safe amount to share is none.',
      },
    ],
    takeaway: 'Passwords and verification codes are for you alone. If someone asks for one, that is the reason to say no.',
  },
];

export function scenarioById(id: string): CoachScenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

/** True when the given answer id is the safest option for the scenario. */
export function isCorrectAnswer(scenario: CoachScenario, answerId: string): boolean {
  const answer = scenario.answers.find((a) => a.id === answerId);
  return answer?.correct === true;
}

export function answerById(scenario: CoachScenario, answerId: string) {
  return scenario.answers.find((a) => a.id === answerId);
}

export interface Tip {
  id: string;
  title: string;
  body: string;
}

/**
 * Contextual tips derived from the real cookie and permission findings.
 * Tips are only produced when the underlying finding is actually present.
 */
export function contextualTips(input: {
  cookieSummary?: { total: number; httpOnly: number; thirdParty: number; persistent: number } | null;
  permissionFindings?: { name: string; state: string }[] | null;
}): Tip[] {
  const tips: Tip[] = [];
  const { cookieSummary, permissionFindings } = input;

  if (cookieSummary) {
    if (cookieSummary.thirdParty > 0) {
      tips.push({
        id: 'tip-third-party',
        title: 'Third-party cookies',
        body: `${cookieSummary.thirdParty} of the cookies here come from another company’s domain. They often power things like embedded videos or adverts. You can turn third-party cookies off in your browser settings without breaking most sites.`,
      });
    }
    if (cookieSummary.httpOnly > 0) {
      tips.push({
        id: 'tip-httponly',
        title: 'Why "HttpOnly" is a good sign',
        body: 'Some cookies here are HttpOnly. That setting stops ordinary page scripts from reading them, which helps protect login sessions. It is one layer of protection, not a guarantee.',
      });
    }
    if (cookieSummary.persistent > 0) {
      tips.push({
        id: 'tip-persistent',
        title: 'Stored cookies outlast your visit',
        body: 'Cookies with an expiry date can stay after you close the browser. On a shared computer, sign out of accounts and consider clearing cookies when you finish.',
      });
    }
  }

  if (permissionFindings) {
    for (const f of permissionFindings) {
      if (f.name === 'notifications' && (f.state === 'prompt' || f.state === 'granted')) {
        tips.push({
          id: 'tip-notifications',
          title: 'Notification requests',
          body: 'This site can ask to send notifications. Only allow that for sites you trust and actually want messages from — otherwise just block it.',
        });
      }
      if ((f.name === 'camera' || f.name === 'microphone') && f.state === 'granted') {
        tips.push({
          id: 'tip-camera',
          title: 'Camera and microphone access',
          body: 'This site is allowed to use your camera or microphone. It only works while you allow it, and most browsers show an indicator when they are on. You can change your mind in site settings at any time.',
        });
      }
      if (f.name === 'geolocation' && f.state === 'granted') {
        tips.push({
          id: 'tip-location',
          title: 'Sharing your location',
          body: 'This site is allowed to use your location. For most sites that is unnecessary — you can set it back to "Ask first" if you are not sure why it needs it.',
        });
      }
    }
  }

  if (tips.length === 0) {
    tips.push({
      id: 'tip-general',
      title: 'How to judge a website',
      body: 'There is no such thing as a site that is simply "safe forever". Look at the address, notice what it asks to do, and treat anything urgent or secretive with extra care. When in doubt, ask a trusted adult.',
    });
  }

  return tips;
}
