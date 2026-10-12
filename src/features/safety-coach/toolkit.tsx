/**
 * The Safety Toolkit: broader web-safety knowledge that is NOT tied to what the
 * browser can inspect. This is the honest home for the topics WebWise cannot
 * detect automatically — phishing, passwords, downloads, scams and more.
 *
 * Keeping the primary tools (Cookies, Permissions) strictly evidence-based, and
 * putting general safety knowledge here, is a deliberate separation. Nothing in
 * this file is ever presented as a live finding about the current page.
 */

export interface ToolkitTopic {
  id: string;
  /** A real question a child might ask. */
  question: string;
  /** The plain-language answer. */
  answer: string;
  /** One concrete thing to try or remember. */
  tryThis: string;
}

export const TOOLKIT_TOPICS: ToolkitTopic[] = [
  {
    id: 'padlock',
    question: 'Does a padlock mean a website is safe?',
    answer:
      'No. A padlock (https) means the connection is private, so nobody in the middle can easily read or change what you send. It says nothing about who owns the site or whether they are honest. Trick websites can have padlocks too.',
    tryThis:
      'Treat the padlock as "this conversation is private", not "this website is trustworthy". Then check the address is really the site you meant.',
  },
  {
    id: 'address',
    question: 'How can I spot a fake web address?',
    answer:
      'Read the address backwards from the ending. The part right before the ending (like .com) is the real owner. Extra words before it can be a disguise: secure-login-yourbank.example.com belongs to example.com, not your bank.',
    tryThis:
      'Cover everything except the last two parts of the name, then ask: is that the company I meant to visit?',
  },
  {
    id: 'passwords',
    question: 'What makes a password strong?',
    answer:
      'Long beats complicated. Four or five random words stuck together (like "copper-otter-cactus-lamp") is stronger than "P@ssw0rd" and easier to remember. Never reuse the same password on different sites.',
    tryThis:
      'Use a different password for anything important, especially email — whoever controls your email can reset your other accounts.',
  },
  {
    id: 'codes',
    question: 'Someone asked for my login code. Should I share it?',
    answer:
      'No — never. A code that arrives by text or an app is a one-time key that lets someone log in as you. Real companies, banks, games and support staff never need you to read it out.',
    tryThis:
      'If anyone asks for a code, that on its own is a strong sign it is a scam. Show a trusted adult instead of replying.',
  },
  {
    id: 'pop-ups',
    question: 'A pop-up says my device is infected. Is it real?',
    answer:
      'Almost never. Real security software does not pop up inside a web page telling you to call a number or install something right now. Urgency is a trick to make you act before you think.',
    tryThis:
      'Close the whole tab. Do not click buttons inside it. If you cannot close it, close the browser completely.',
  },
  {
    id: 'downloads',
    question: 'A file started downloading that I did not ask for — what now?',
    answer:
      'Treat unexpected downloads as suspicious. Files that end in .exe, .scr, .js or .zip from somewhere you did not choose can run code on your device. Needing to "enable macros" in a document is another common trick.',
    tryThis:
      'If you did not ask for the file, delete it and do not open it. Tell an adult if it happened by itself.',
  },
  {
    id: 'notifications',
    question: 'Should I allow notifications from a website?',
    answer:
      'Allow it only for sites you actually want messages from. A notification can pop up on your screen even when the site is closed, and some sites use them to show adverts or scary fake warnings later.',
    tryThis:
      'If you already allowed one and regret it, you can block it again in your browser settings for that site.',
  },
  {
    id: 'personal',
    question: 'What information should I keep private online?',
    answer:
      'Your full name with your address, your school, your phone number, your exact location and photos that show where you live. Small pieces add up — a scammer can combine them to guess passwords or answer security questions.',
    tryThis:
      'Before posting, imagine a stranger reading it and asking: what could they work out about me from this?',
  },
  {
    id: 'free-offers',
    question: 'Why do "you have won a prize" messages always feel urgent?',
    answer:
      'Because urgency stops you comparing notes with anyone. Real prizes do not need your password, a small "delivery fee", or a code to claim them. If you must act right now or lose it, that is the warning sign.',
    tryThis:
      'Pause and tell a trusted adult. Scams rely on you being alone and in a hurry.',
  },
  {
    id: 'trackers',
    question: 'Why do adverts seem to follow me between websites?',
    answer:
      'Sites often include content from other companies, and those companies can set their own cookies. Those third-party cookies can recognise you on several sites. It is usually for adverts or measuring, not a person watching you.',
    tryThis:
      'You can turn third-party cookies off or clear cookies in your browser settings. Most sites keep working.',
  },
];


