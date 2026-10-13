import type { CoachCategory, CoachScenario } from '../../types';

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
    category: 'links',
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
    category: 'downloads',
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
    category: 'popups',
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
    category: 'passwords',
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
    category: 'social',
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
  return ALL_SCENARIOS.find((s) => s.id === id);
}

/** Human-friendly name for a scenario's topic group. */
export const CATEGORY_LABELS: Record<CoachCategory, string> = {
  links: 'Links & addresses',
  downloads: 'Downloads & files',
  passwords: 'Logins & passwords',
  popups: 'Pop-ups & permissions',
  privacy: 'Privacy & data',
  shopping: 'Shopping & money',
  social: 'Messages & people',
};

/**
 * A larger bank of practice scenarios. These are shuffled into rounds so the
 * Coach feels varied instead of repeating the same five examples. Every one is
 * an invented, safe example — no real site, file or credential.
 */
export const PRACTICE_SCENARIOS: CoachScenario[] = [
  /* ------------------------------- links --------------------------------- */
  {
    id: 'quiz-prize-link',
    category: 'links',
    title: 'A link that promises free robux',
    intro: 'A comment under a video says you can get free in-game money from a link.',
    example: 'free-robux-generator.example.net/claim-now',
    exampleDetail: 'It asks for your game username and password to "verify" you.',
    question: 'What is the safest choice?',
    answers: [
      {
        id: 'a',
        text: 'Use it, but only enter a made-up password.',
        correct: false,
        feedback:
          'It still collects your username and shows you the site works for tricking people. Real in-game currency is never given away by a random link.',
      },
      {
        id: 'b',
        text: 'Ignore it. Nothing is free just for clicking, and never type your game password into it.',
        correct: true,
        feedback:
          'Right. If it were real it would be inside the game itself, not on a strange address. "Free currency" links are one of the oldest tricks there is.',
      },
      {
        id: 'c',
        text: 'Share it with friends so they get it too.',
        correct: false,
        feedback:
          'Sharing spreads the trick to people who trust you. That is exactly how these links travel.',
      },
    ],
    takeaway: 'If a reward only appears through a strange link, it is bait. Real rewards live inside the real app.',
  },
  {
    id: 'typo-address',
    category: 'links',
    title: 'The address with a swapped letter',
    intro: 'You want a popular video site but type the name quickly.',
    example: 'www.youtub.com (missing the final "e")',
    exampleDetail: 'The page looks almost exactly like the real one.',
    question: 'Why does this matter?',
    answers: [
      {
        id: 'a',
        text: 'It does not matter — the page looks the same.',
        correct: false,
        feedback:
          'A copied page can look perfect. The address is the part a scammer cannot borrow from the real site.',
      },
      {
        id: 'b',
        text: 'A single wrong letter can send you to a copy that looks real but is controlled by someone else.',
        correct: true,
        feedback:
          'Exactly. Misspelled addresses are bought on purpose to catch people who type quickly. Check the address, and use a bookmark for sites you visit often.',
      },
      {
        id: 'c',
        text: 'Wrong addresses always fail to load.',
        correct: false,
        feedback:
          'Often they load perfectly — that is the danger. Someone has deliberately set up a look-alike.',
      },
    ],
    takeaway: 'Read the address, not just the page. A bookmark saves you from typo tricks.',
  },
  {
    id: 'shortened-link',
    category: 'links',
    title: 'A shortened link with no clue',
    intro: 'Someone sends you a link that has been shortened.',
    example: 'bit.example/3xY9q',
    exampleDetail: 'You cannot tell where it really goes from the address alone.',
    question: 'What is the safest approach?',
    answers: [
      {
        id: 'a',
        text: 'Open it — shortened links are always fine.',
        correct: false,
        feedback:
          'Shortened links hide their destination on purpose. Some are harmless, but you cannot tell by looking.',
      },
      {
        id: 'b',
        text: 'Ask the sender what it is, or avoid it unless you trust them and expected it.',
        correct: true,
        feedback:
          'Good. If you did not expect it, do not open it. Ask the person directly, and remember their account could have been taken over.',
      },
      {
        id: 'c',
        text: 'Open it but turn off your Wi-Fi first.',
        correct: false,
        feedback:
          'Turning off Wi-Fi does not make an unknown link safe — it just stops the page loading. The risk is in where the link leads.',
      },
    ],
    takeaway: 'A hidden destination is a reason to ask first. You are allowed to say "what is this?".',
  },

  /* ----------------------------- downloads ------------------------------- */
  {
    id: 'mod-download',
    category: 'downloads',
    title: 'A "mod" for your favourite game',
    intro: 'A video description links to a game mod you did not get from the game store.',
    example: 'coolgame-mod-pack.example.org/setup.exe',
    exampleDetail: 'The comments are full of people saying "thanks, it worked!".',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Download and run it — the comments say it works.',
        correct: false,
        feedback:
          'Comments can be faked or written by people who got tricked. An .exe from an unknown site can install anything on your computer.',
      },
      {
        id: 'b',
        text: 'Skip it. Only install things from the official store or a source an adult trusts.',
        correct: true,
        feedback:
          'Right. Official stores check what they offer. Unknown files do not, and "it worked for them" says nothing about what it does to your device.',
      },
      {
        id: 'c',
        text: 'Download it but never open it.',
        correct: false,
        feedback:
          'Downloading is less risky than running, but the safest move is not to fetch unknown software at all.',
      },
    ],
    takeaway: 'Get software from official stores. Enthusiastic comments are not a safety check.',
  },
  {
    id: 'fake-update',
    category: 'downloads',
    title: 'A sudden "update your browser" page',
    intro: 'A website claims your browser is out of date and offers a file to fix it.',
    example: 'Your browser is out of date — download update now',
    exampleDetail: 'Real browsers update themselves quietly; they do not send you files from random sites.',
    question: 'What is the safest action?',
    answers: [
      {
        id: 'a',
        text: 'Download the file it offers.',
        correct: false,
        feedback:
          'Genuine browser updates come from the browser itself, not from a website you happened to visit.',
      },
      {
        id: 'b',
        text: 'Close the page. Update your browser through its own menu or settings if you want to.',
        correct: true,
        feedback:
          'Exactly. Fake update pages are a common way to hand out harmful files. Your browser updates itself in the background.',
      },
      {
        id: 'c',
        text: 'Click the button but cancel the download.',
        correct: false,
        feedback:
          'Better to leave the page entirely. There is no reason to trust a file offered by a random site.',
      },
    ],
    takeaway: 'Browsers update themselves. A website telling you to download an update is a warning sign.',
  },
  {
    id: 'email-attachment',
    category: 'downloads',
    title: 'An attachment from an unknown sender',
    intro: 'An email you did not expect arrives with a file attached.',
    example: 'Invoice_2024.zip attached',
    exampleDetail: 'You do not recognise the sender or remember ordering anything.',
    question: 'What do you do with the attachment?',
    answers: [
      {
        id: 'a',
        text: 'Open it to see what it is.',
        correct: false,
        feedback:
          'Unexpected attachments are a classic way to deliver harmful files. You do not need to open it to find out — you did not ask for it.',
      },
      {
        id: 'b',
        text: 'Leave it closed and show a trusted adult.',
        correct: true,
        feedback:
          'Right. Not opening it is the whole defence. An adult can check whether the message is real through another route.',
      },
      {
        id: 'c',
        text: 'Forward it to a friend to see if it opens for them.',
        correct: false,
        feedback:
          'That passes the problem to someone else. Keep it closed and let an adult decide.',
      },
    ],
    takeaway: 'An attachment you did not expect can stay unopened. You never have to open it to be safe.',
  },

  /* ----------------------------- passwords ------------------------------- */
  {
    id: 'same-password',
    category: 'passwords',
    title: 'Using one password everywhere',
    intro: 'You have one password you use for every game and site.',
    example: 'One password for your game, your email and your school account',
    exampleDetail: 'It is easy to remember.',
    question: 'Why is this risky?',
    answers: [
      {
        id: 'a',
        text: 'It is fine as long as the password is long.',
        correct: false,
        feedback:
          'Length helps, but if one site is ever breached, the same password unlocks all your other accounts.',
      },
      {
        id: 'b',
        text: 'If one site leaks it, someone can use it to get into all your other accounts.',
        correct: true,
        feedback:
          'Exactly. Different passwords keep one leak from spreading. A password manager can remember them for you.',
      },
      {
        id: 'c',
        text: 'It is risky only on websites you do not know.',
        correct: false,
        feedback:
          'Even well-known sites can be breached. Reusing a password means one leak affects everything.',
      },
    ],
    takeaway: 'One password, one account. Reuse turns a single leak into many.',
  },
  {
    id: 'share-password-friend',
    category: 'passwords',
    title: 'A friend asks to borrow your login',
    intro: 'A friend wants to play on your account and asks for your password.',
    example: '"Just give me your password, I will only use it once."',
    exampleDetail: 'They are a real friend, not a stranger.',
    question: 'What is the safest answer?',
    answers: [
      {
        id: 'a',
        text: 'Share it — they are your friend.',
        correct: false,
        feedback:
          'Even a real friend can lose the password or share it further without meaning to. The account is yours to protect.',
      },
      {
        id: 'b',
        text: 'Say no. Passwords stay private, even between friends.',
        correct: true,
        feedback:
          'Right. A good friend understands. If the game has a way to share or visit in-game, use that instead.',
      },
      {
        id: 'c',
        text: 'Share it but change it later.',
        correct: false,
        feedback:
          'By then the password may already be used elsewhere. The safe habit is not to share it at all.',
      },
    ],
    takeaway: 'Passwords are private, even from friends. There is always a safer way to play together.',
  },
  {
    id: 'password-manager',
    category: 'passwords',
    title: 'Remembering lots of passwords',
    intro: 'You have many accounts and cannot remember strong passwords for each.',
    example: 'What is a safe way to keep track of them?',
    question: 'Which option is safest?',
    answers: [
      {
        id: 'a',
        text: 'Write them all in a note called "passwords" on your phone.',
        correct: false,
        feedback:
          'A plain note is easy for anyone with your device to read, and easy to lose or sync by accident.',
      },
      {
        id: 'b',
        text: 'Use your browser’s or a trusted password manager, protected by your device or an adult’s account.',
        correct: true,
        feedback:
          'Correct. A password manager makes strong, unique passwords for each site and remembers them for you.',
      },
      {
        id: 'c',
        text: 'Use your birthday so it is easy to remember.',
        correct: false,
        feedback:
          'Birthdays and pet names are the first things attackers try. Easy to remember for you means easy to guess for others.',
      },
    ],
    takeaway: 'Let a password manager remember for you. Strong and unique beats easy to guess.',
  },

  /* ------------------------------ popups --------------------------------- */
  {
    id: 'popup-virus-scan',
    category: 'popups',
    title: '"Your device has 3 viruses!"',
    intro: 'A pop-up appears claiming your device is infected and offering a scan.',
    example: 'WARNING: 3 viruses found! Scan now',
    exampleDetail: 'It has a big button and a countdown timer.',
    question: 'What is the safest response?',
    answers: [
      {
        id: 'a',
        text: 'Click Scan now to fix it.',
        correct: false,
        feedback:
          'Web pages cannot scan your device. The button is designed to make you click it — that is the trick.',
      },
      {
        id: 'b',
        text: 'Close the pop-up or the tab. A web page cannot really scan your device.',
        correct: true,
        feedback:
          'Exactly. Real security tools live on your device, not in a pop-up. If it will not close, closing the whole tab works.',
      },
      {
        id: 'c',
        text: 'Leave it open and keep browsing.',
        correct: false,
        feedback:
          'Pop-ups like this often block what you are doing and keep nagging. Close them and move on.',
      },
    ],
    takeaway: 'A website cannot scan your device. "Virus found" pop-ups are adverts pretending to be alarms.',
  },
  {
    id: 'popup-fullscreen',
    category: 'popups',
    title: 'A page that will not let you leave',
    intro: 'A site goes fullscreen and shows a fake warning with no close button.',
    example: 'Your computer is locked! Call this number immediately.',
    exampleDetail: 'It tries to stop you from using the back button.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Call the number it shows.',
        correct: false,
        feedback:
          'That number belongs to the scammer. Nobody legitimate locks your device and asks you to phone them.',
      },
      {
        id: 'b',
        text: 'Force the browser or tab closed, then get an adult.',
        correct: true,
        feedback:
          'Right. The browser always has a way out — press Esc to leave fullscreen, or close the tab/window. It is a fake warning, not a real lock.',
      },
      {
        id: 'c',
        text: 'Keep clicking the buttons to find a way out.',
        correct: false,
        feedback:
          'Clicking the page is what it wants. Use the browser controls instead: Esc, close tab, or close the window.',
      },
    ],
    takeaway: 'The browser always lets you out. Use Esc or close the tab — never call the number.',
  },
  {
    id: 'fake-antivirus-app',
    category: 'popups',
    title: 'A page offers a "security app"',
    intro: 'A pop-up says you need an app to "protect your phone".',
    example: 'Install our security app to stay safe',
    exampleDetail: 'It is not from your device’s app store.',
    question: 'What is the safest choice?',
    answers: [
      {
        id: 'a',
        text: 'Install it — it says it is for security.',
        correct: false,
        feedback:
          'Claiming to be security software is a common disguise. Apps from outside the official store are not checked the same way.',
      },
      {
        id: 'b',
        text: 'Do not install it. Use the official app store and ask an adult.',
        correct: true,
        feedback:
          'Exactly. Official stores review apps before offering them. A random pop-up has no such checks.',
      },
      {
        id: 'c',
        text: 'Install it, then uninstall it after.',
        correct: false,
        feedback:
          'Installing is the risky step. Best not to install unknown software at all.',
      },
    ],
    takeaway: 'Get apps only from official stores. "Security" in the name proves nothing.',
  },

  /* ------------------------------ privacy -------------------------------- */
  {
    id: 'cookie-banner',
    category: 'privacy',
    title: 'A cookie banner with only one easy button',
    intro: 'A site shows a cookie notice where "Accept all" is huge and the rest is hidden.',
    example: 'Accept all cookies — or manage preferences (small link)',
    exampleDetail: 'You are not sure what you are agreeing to.',
    question: 'What is the safer habit?',
    answers: [
      {
        id: 'a',
        text: 'Always click Accept all to get it out of the way.',
        correct: false,
        feedback:
          'The biggest button is not always the best one. Accepting everything can allow more tracking than you need.',
      },
      {
        id: 'b',
        text: 'Look for the options and choose only what you are comfortable with, or reject non-essential ones.',
        correct: true,
        feedback:
          'Right. You are allowed to say no to non-essential cookies. If the choice is hidden, that is worth noticing.',
      },
      {
        id: 'c',
        text: 'Close the tab and never use the site again.',
        correct: false,
        feedback:
          'You can usually stay and still limit the cookies — no need to leave, just choose carefully.',
      },
    ],
    takeaway: 'Read the choice, not just the biggest button. You can refuse non-essential cookies.',
  },
  {
    id: 'app-permissions',
    category: 'privacy',
    title: 'An app wants your location and contacts',
    intro: 'A simple game asks for permission to see your location and your contacts.',
    example: 'Allow "Fun Bubbles" to access: Location, Contacts',
    exampleDetail: 'The game is about popping bubbles. It does not need either.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Allow both so the game works.',
        correct: false,
        feedback:
          'A bubble game does not need your location or contacts. Permissions should match what the app actually does.',
      },
      {
        id: 'b',
        text: 'Say no. Ask yourself whether the app really needs it to work.',
        correct: true,
        feedback:
          'Exactly. If a permission does not fit what the app does, declining is reasonable. Many apps work fine without them.',
      },
      {
        id: 'c',
        text: 'Allow location but not contacts.',
        correct: false,
        feedback:
          'Better, but a bubble game needs neither. Ask why it wants each one before allowing anything.',
      },
    ],
    takeaway: 'Permissions should match the job. If they do not fit, it is fine to say no.',
  },
  {
    id: 'public-post',
    category: 'privacy',
    title: 'Posting a photo with clues in it',
    intro: 'You are about to post a photo from outside your house.',
    example: 'A photo that shows your street sign and school badge',
    exampleDetail: 'Your profile is public.',
    question: 'What is the safer choice?',
    answers: [
      {
        id: 'a',
        text: 'Post it — it is just a photo.',
        correct: false,
        feedback:
          'Photos can reveal where you live, your school and your routines. Together, small clues add up.',
      },
      {
        id: 'b',
        text: 'Check what the photo gives away, and share only with people you trust.',
        correct: true,
        feedback:
          'Right. Look for street signs, badges and landmarks. Sharing with a smaller audience is safer than posting publicly.',
      },
      {
        id: 'c',
        text: 'Post it but delete it after an hour.',
        correct: false,
        feedback:
          'Once it is posted it can be saved or shared before you delete it. Think first, not after.',
      },
    ],
    takeaway: 'Photos carry clues. Check what they reveal before you share.',
  },
  {
    id: 'public-wifi',
    category: 'privacy',
    title: 'Free Wi-Fi in a café',
    intro: 'You connect to free public Wi-Fi to play a game online.',
    example: 'Network: "Free Cafe WiFi" (no password)',
    exampleDetail: 'You are not sure who set it up.',
    question: 'What is the safer habit?',
    answers: [
      {
        id: 'a',
        text: 'Log into your bank and email while connected.',
        correct: false,
        feedback:
          'Avoid signing into important accounts on networks you do not control. Use mobile data for anything sensitive.',
      },
      {
        id: 'b',
        text: 'Stick to ordinary browsing and avoid signing into important accounts.',
        correct: true,
        feedback:
          'Good. Free Wi-Fi is fine for simple things. Keep logins and personal details for networks you trust.',
      },
      {
        id: 'c',
        text: 'Assume it is safe because it has no password.',
        correct: false,
        feedback:
          'No password means anyone nearby can join too. It says nothing about who runs it or how safe it is.',
      },
    ],
    takeaway: 'On public Wi-Fi, browse simply and keep important logins for trusted networks.',
  },

  /* ----------------------------- shopping -------------------------------- */
  {
    id: 'too-good-deal',
    category: 'shopping',
    title: 'A deal that is too good to be true',
    intro: 'An advert offers a popular game console for a tiny price.',
    example: 'Brand new console — 90% off, today only!',
    exampleDetail: 'The shop is a site you have never heard of.',
    question: 'What is the safest approach?',
    answers: [
      {
        id: 'a',
        text: 'Buy it fast before the offer ends.',
        correct: false,
        feedback:
          'Urgency is a pressure tactic. A price far below normal usually means there is no real product, or it is not genuine.',
      },
      {
        id: 'b',
        text: 'Be suspicious. Check with an adult and stick to shops you or they trust.',
        correct: true,
        feedback:
          'Right. If a deal seems impossible, it usually is. Trusted shops and adult help protect your money.',
      },
      {
        id: 'c',
        text: 'Buy it but use a parent’s card without asking.',
        correct: false,
        feedback:
          'Never use someone else’s payment details, and never without asking. That is both unsafe and not allowed.',
      },
    ],
    takeaway: 'Pressure and impossible prices are warning signs. Check with an adult before buying.',
  },
  {
    id: 'fake-order-email',
    category: 'shopping',
    title: 'An email about an order you did not make',
    intro: 'An email says you ordered something expensive and links to "cancel" it.',
    example: 'Your order of 499.00 is confirmed — click to cancel',
    exampleDetail: 'You never ordered anything like this.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Click the link quickly to cancel the order.',
        correct: false,
        feedback:
          'The link is the trap. The email is designed to make you panic and click without thinking.',
      },
      {
        id: 'b',
        text: 'Do not click. Show an adult, and check the real account directly if worried.',
        correct: true,
        feedback:
          'Exactly. Reach the company by typing its address yourself, never through the email’s link.',
      },
      {
        id: 'c',
        text: 'Reply to the email asking for details.',
        correct: false,
        feedback:
          'Replying confirms your address is active and reaches the scammer, not the real company.',
      },
    ],
    takeaway: 'Surprise orders are bait for a click. Check the real site yourself, never the link.',
  },

  /* ------------------------------ social --------------------------------- */
  {
    id: 'stranger-friend-request',
    category: 'social',
    title: 'A message from a "friend of a friend"',
    intro: 'Someone you do not know sends a friendly message and asks to chat privately.',
    example: '"Hi! Your friend said we should talk. What’s your school?"',
    exampleDetail: 'They have no mutual friends you recognise.',
    question: 'What is the safest response?',
    answers: [
      {
        id: 'a',
        text: 'Answer their questions to be polite.',
        correct: false,
        feedback:
          'Polite does not mean safe. Questions about your school or routine are exactly what you should keep private.',
      },
      {
        id: 'b',
        text: 'Do not share personal details, and tell a trusted adult.',
        correct: true,
        feedback:
          'Right. You never have to chat with someone you do not know. Keeping personal details private and telling an adult is the safe path.',
      },
      {
        id: 'c',
        text: 'Keep chatting but give fake answers.',
        correct: false,
        feedback:
          'Staying in the chat keeps the door open. It is safer to stop and involve an adult.',
      },
    ],
    takeaway: 'You never have to chat with strangers. Keep personal details private and tell an adult.',
  },
  {
    id: 'urgent-message',
    category: 'social',
    title: 'A message that says you are in trouble',
    intro: 'A message claims your account will be deleted unless you act right now.',
    example: 'Your account will be DELETED in 10 minutes — verify now!',
    exampleDetail: 'It includes a link to "verify".',
    question: 'What is the safest choice?',
    answers: [
      {
        id: 'a',
        text: 'Click verify straight away to be safe.',
        correct: false,
        feedback:
          'Real companies do not delete accounts in ten minutes. The countdown is there to stop you thinking.',
      },
      {
        id: 'b',
        text: 'Slow down. Do not click; go to the service’s real site yourself or ask an adult.',
        correct: true,
        feedback:
          'Exactly. Urgency is the trick. Reaching the real site your own way shows you the truth without risking your account.',
      },
      {
        id: 'c',
        text: 'Click verify but enter nothing.',
        correct: false,
        feedback:
          'Just visiting the link can be enough to start trouble. Do not click — go to the real site instead.',
      },
    ],
    takeaway: 'Urgency is a tool to rush you. Slow down and check through the real site.',
  },
  {
    id: 'chain-message',
    category: 'social',
    title: 'A chain message you are told to forward',
    intro: 'A message says you must forward it to ten friends or something bad happens.',
    example: '"Forward this to 10 friends or your account will be closed!"',
    exampleDetail: 'It has been forwarded many times already.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Forward it — better safe than sorry.',
        correct: false,
        feedback:
          'Nothing happens if you do not forward it. Chain messages are made to spread, often to collect active contacts.',
      },
      {
        id: 'b',
        text: 'Do not forward it. These are not real, and forwarding spreads them.',
        correct: true,
        feedback:
          'Right. Chain messages are a nuisance, not a warning. Deleting them stops the spread.',
      },
      {
        id: 'c',
        text: 'Forward it to just one person.',
        correct: false,
        feedback:
          'Even one forward keeps the chain going. The safe number of forwards is none.',
      },
    ],
    takeaway: 'Chain messages are not real. You lose nothing by not forwarding them.',
  },
  {
    id: 'oversharing-comment',
    category: 'social',
    title: 'Answering personal questions in comments',
    intro: 'A friendly post asks everyone to share their pet’s name and first school.',
    example: '"Comment your first pet and your school for a fun badge!"',
    exampleDetail: 'These are common answers people use for security questions.',
    question: 'What is the safer choice?',
    answers: [
      {
        id: 'a',
        text: 'Answer with both — it is just for fun.',
        correct: false,
        feedback:
          'Pet names and schools are exactly the answers used to reset passwords. Sharing them can hand over your account.',
      },
      {
        id: 'b',
        text: 'Skip it, or share nothing personal. Fun questions can still collect private answers.',
        correct: true,
        feedback:
          'Exactly. The safest answers to questions like these are the ones you do not post.',
      },
      {
        id: 'c',
        text: 'Answer but only the pet name.',
        correct: false,
        feedback:
          'Pet names are a common security answer on their own. Best to keep them private.',
      },
    ],
    takeaway: 'Fun questions can still collect private answers. Think before you comment.',
  },

  /* --------------------- more links & addresses -------------------------- */
  {
    id: 'qr-code-link',
    category: 'links',
    title: 'A QR code stuck over the real one',
    intro: 'You scan a QR code on a poster to open a menu.',
    example: 'The code opens pay-fast.example.net/signin',
    exampleDetail: 'The real menu should never ask you to sign in.',
    question: 'What is the safest response?',
    answers: [
      {
        id: 'a',
        text: 'Sign in — it opened, so it must be the real menu.',
        correct: false,
        feedback:
          'Anyone can print a sticker and put it over a real code. The address it opens is the thing to check, not the fact that it opened.',
      },
      {
        id: 'b',
        text: 'Close it. If it asks for a login you did not expect, it is not the real page.',
        correct: true,
        feedback:
          'Right. A menu does not need your password. Unexpected logins after scanning are a warning sign.',
      },
      {
        id: 'c',
        text: 'Scan it again to be sure.',
        correct: false,
        feedback:
          'Scanning again shows the same wrong address. The problem is where it leads, not how many times you scan.',
      },
    ],
    takeaway: 'A QR code is just a link. Check where it leads before you trust it.',
  },
  {
    id: 'game-chat-link',
    category: 'links',
    title: 'A link dropped in a game chat',
    intro: 'Another player posts a link offering free in-game items.',
    example: 'claim-items.example.org/free',
    exampleDetail: 'They say you must log in with your game account.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Open it and log in for the free items.',
        correct: false,
        feedback:
          'Typing your game login into an outside link is how accounts get stolen. Real rewards come from inside the game.',
      },
      {
        id: 'b',
        text: 'Do not open it or log in. Free items in chat are bait.',
        correct: true,
        feedback:
          'Exactly. Never enter your game login outside the game itself, no matter what is promised.',
      },
      {
        id: 'c',
        text: 'Open it but do not log in.',
        correct: false,
        feedback:
          'Even opening it can be a step toward a copy of the login page. Safer to leave it alone.',
      },
    ],
    takeaway: 'Only ever sign in to a game inside the game. Chat links are bait for your login.',
  },
  {
    id: 'lookalike-domain',
    category: 'links',
    title: 'A name that adds extra words',
    intro: 'A message links to a page for a well-known store.',
    example: 'store-secure-checkout.example.com/login',
    exampleDetail: 'The real store’s address is just the store name and its ending.',
    question: 'How can you tell this is risky?',
    answers: [
      {
        id: 'a',
        text: 'It has a padlock, so it is safe.',
        correct: false,
        feedback:
          'A padlock only means the connection is private — it says nothing about who owns the site. Anyone can get one.',
      },
      {
        id: 'b',
        text: 'The extra words like "secure" and "checkout" are added to look official but are not the real name.',
        correct: true,
        feedback:
          'Exactly. The real owner is the name just before the ending. Extra words are often used to look trustworthy.',
      },
      {
        id: 'c',
        text: 'It has "example.com", so it is fine.',
        correct: false,
        feedback:
          'The part before the ending is what matters. Adding words to a name is a common way to fake an address.',
      },
    ],
    takeaway: 'Look at the name right before the ending. Extra words like "secure" prove nothing.',
  },

  /* --------------------- more downloads & files -------------------------- */
  {
    id: 'free-screensaver',
    category: 'downloads',
    title: 'A "free screensaver" that installs extra things',
    intro: 'You download a free screensaver from a random site.',
    example: 'The installer has extra boxes ticked by default.',
    exampleDetail: 'They offer to add a "search helper" and a toolbar.',
    question: 'What is the safest choice?',
    answers: [
      {
        id: 'a',
        text: 'Click Next quickly and accept the defaults.',
        correct: false,
        feedback:
          'Ticked-by-default extras are how unwanted software gets installed. Reading each step is worth the few seconds.',
      },
      {
        id: 'b',
        text: 'Read each step and untick anything you did not ask for — or skip the download.',
        correct: true,
        feedback:
          'Right. Bundled extras are common. If you cannot tell what you are agreeing to, it is fine to walk away.',
      },
      {
        id: 'c',
        text: 'Install everything, then remove it later.',
        correct: false,
        feedback:
          'Unwanted software can be hard to remove and may change your browser. Better not to install it in the first place.',
      },
    ],
    takeaway: 'Read installer steps. Boxes ticked for you are extras you did not ask for.',
  },
  {
    id: 'file-ready-download',
    category: 'downloads',
    title: '"Your file is ready" without asking',
    intro: 'A page you opened starts downloading a file called document.pdf.exe',
    example: 'document.pdf.exe is downloading…',
    exampleDetail: 'The name has two endings, and the last one is .exe.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Open it — it says "pdf", so it is a document.',
        correct: false,
        feedback:
          'The last part of the name decides what the file is. ".pdf.exe" is a program pretending to be a document.',
      },
      {
        id: 'b',
        text: 'Cancel it. A document does not need to be a program, and two endings is a warning sign.',
        correct: true,
        feedback:
          'Exactly. Real documents end in .pdf or .docx. Ending in .exe means it is software you did not ask for.',
      },
      {
        id: 'c',
        text: 'Rename it to document.pdf and open it.',
        correct: false,
        feedback:
          'Renaming does not change what the file does. The last ending is the real one, no matter what you call it.',
      },
    ],
    takeaway: 'Read the whole file name. The last ending is what the file really is.',
  },
  {
    id: 'fake-driver-update',
    category: 'downloads',
    title: 'A page offers a "driver update"',
    intro: 'A site claims your computer needs a special driver file.',
    example: 'Your device needs DriverBooster update now',
    exampleDetail: 'You were only reading an article.',
    question: 'What is the safest action?',
    answers: [
      {
        id: 'a',
        text: 'Download and run the driver file.',
        correct: false,
        feedback:
          'Real drivers come from the device maker or your computer’s own update tool, not from an article you were reading.',
      },
      {
        id: 'b',
        text: 'Close the page. Update through your computer’s own settings or an adult.',
        correct: true,
        feedback:
          'Right. Random "driver" files are a common way to hand out harmful software. Your computer updates itself safely.',
      },
      {
        id: 'c',
        text: 'Download it but scan it first with an online tool.',
        correct: false,
        feedback:
          'The safest move is not to download unknown software at all. Use your system’s own updater.',
      },
    ],
    takeaway: 'Updates come from your computer or the maker, not from a page you happened to open.',
  },

  /* --------------------- more logins & passwords ------------------------- */
  {
    id: 'weak-password',
    category: 'passwords',
    title: 'A password that is too easy',
    intro: 'You are choosing a password for a new account.',
    example: 'Which is the stronger choice?',
    question: 'Which password is safer?',
    answers: [
      {
        id: 'a',
        text: 'Your name and birthday, like sam2015.',
        correct: false,
        feedback:
          'Names and birthdays are the first things anyone would try. They are easy to remember for you, and for others too.',
      },
      {
        id: 'b',
        text: 'A long mix of words, like blue-Otter-boots-7.',
        correct: true,
        feedback:
          'Correct. Long and unusual beats short and complicated. Several random words are easy to remember and hard to guess.',
      },
      {
        id: 'c',
        text: 'The word "password" with a 1 at the end.',
        correct: false,
        feedback:
          '"password1" is on every guessing list. Common words with a number added are still weak.',
      },
    ],
    takeaway: 'Long and unusual beats short and clever. Several random words work well.',
  },
  {
    id: 'shared-document-password',
    category: 'passwords',
    title: 'A password written in a shared document',
    intro: 'You need to share a login with a family member.',
    example: 'You could put the password in a shared online doc.',
    exampleDetail: 'The doc is shared with more people than you meant.',
    question: 'What is the safer option?',
    answers: [
      {
        id: 'a',
        text: 'Put it in the shared doc so it is easy to find.',
        correct: false,
        feedback:
          'A shared doc can be seen by everyone it is shared with, and often by anyone with the link. Passwords should not live there.',
      },
      {
        id: 'b',
        text: 'Use your browser’s or a trusted password manager to share it privately instead.',
        correct: true,
        feedback:
          'Right. A password manager shares with the people you choose, and keeps the password out of documents and chat.',
      },
      {
        id: 'c',
        text: 'Write it in the doc but delete it later.',
        correct: false,
        feedback:
          'Deleting later leaves a history, and someone may already have seen it. Share it privately from the start.',
      },
    ],
    takeaway: 'Keep passwords out of shared documents and chats. Share them privately instead.',
  },
  {
    id: 'shared-computer-remember-me',
    category: 'passwords',
    title: '"Remember me" on a shared computer',
    intro: 'You sign in to an account on a school or library computer.',
    example: 'The login page offers "Keep me signed in".',
    exampleDetail: 'Other people will use this computer after you.',
    question: 'What is the safer choice?',
    answers: [
      {
        id: 'a',
        text: 'Tick "Keep me signed in" so it is quicker next time.',
        correct: false,
        feedback:
          'On a shared computer, staying signed in lets the next person use your account. Anyone could open your messages.',
      },
      {
        id: 'b',
        text: 'Leave it unticked, and sign out when you finish.',
        correct: true,
        feedback:
          'Exactly. On shared computers, never stay signed in, and always sign out. It takes a moment and protects your account.',
      },
      {
        id: 'c',
        text: 'Tick it but close the browser afterwards.',
        correct: false,
        feedback:
          '"Keep me signed in" is designed to survive closing the browser, so closing it is not enough. Sign out instead.',
      },
    ],
    takeaway: 'On shared computers, never stay signed in — and always sign out when you finish.',
  },

  /* --------------------- more pop-ups & permissions ---------------------- */
  {
    id: 'survey-reward-popup',
    category: 'popups',
    title: 'A pop-up promises a reward for a survey',
    intro: 'A pop-up offers a gift card for answering a few questions.',
    example: 'Answer 3 questions to win a 50 gift card!',
    exampleDetail: 'The last step asks for your address and a payment detail.',
    question: 'What is the safest response?',
    answers: [
      {
        id: 'a',
        text: 'Finish the survey — it is only a few questions.',
        correct: false,
        feedback:
          'The survey is the bait. The real point is the last step, where it collects personal details.',
      },
      {
        id: 'b',
        text: 'Close it. A real reward never needs your address or payment details for a survey.',
        correct: true,
        feedback:
          'Right. Rewards that ask for private details are collecting them, not giving anything away.',
      },
      {
        id: 'c',
        text: 'Answer the questions but skip the last step.',
        correct: false,
        feedback:
          'Better to close it. Your answers are still being collected, and the pop-up keeps nagging.',
      },
    ],
    takeaway: 'If a "reward" asks for private details, it is collecting them, not giving.',
  },
  {
    id: 'click-to-continue-loop',
    category: 'popups',
    title: 'A page that keeps saying "click to continue"',
    intro: 'Every time you click, the page shows the same message again.',
    example: 'Click here to continue… click here to continue…',
    exampleDetail: 'It never actually loads what you wanted.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Keep clicking until it works.',
        correct: false,
        feedback:
          'Endless "click to continue" pages are usually collecting clicks or showing adverts. Clicking more will not help.',
      },
      {
        id: 'b',
        text: 'Close the tab. It is a trick to keep you clicking.',
        correct: true,
        feedback:
          'Exactly. If a page never lets you continue, it is not giving you what you wanted. Close it and move on.',
      },
      {
        id: 'c',
        text: 'Open it in more tabs to load faster.',
        correct: false,
        feedback:
          'More tabs just means more of the same. Closing it is the way out.',
      },
    ],
    takeaway: 'A page that never lets you continue is wasting your clicks. Close it.',
  },
  {
    id: 'extension-install-request',
    category: 'popups',
    title: 'A site asks you to install its extension',
    intro: 'A page says you must add a browser extension to continue.',
    example: 'Add "FastSaver" to your browser to unlock this page',
    exampleDetail: 'You have never heard of this extension.',
    question: 'What is the safest choice?',
    answers: [
      {
        id: 'a',
        text: 'Install it — you want to see the page.',
        correct: false,
        feedback:
          'Extensions can read and change the pages you visit. Installing one because a page told you to is risky.',
      },
      {
        id: 'b',
        text: 'Do not install it. Extensions should come from the official store, not from a page’s demand.',
        correct: true,
        feedback:
          'Right. Get extensions only from the official store, and only when you decided you want them.',
      },
      {
        id: 'c',
        text: 'Install it and remove it straight after.',
        correct: false,
        feedback:
          'Installing is the risky step. Even briefly, it can access your pages and data.',
      },
    ],
    takeaway: 'Never install an extension just because a page demands it. Choose your own from the store.',
  },

  /* --------------------- more privacy & data ----------------------------- */
  {
    id: 'screen-recording-permission',
    category: 'privacy',
    title: 'A site asks to record your screen',
    intro: 'A page asks to share your screen to "help you".',
    example: 'Share your screen to continue with support',
    exampleDetail: 'You did not contact this site for help.',
    question: 'What is the safest response?',
    answers: [
      {
        id: 'a',
        text: 'Share your screen — they want to help.',
        correct: false,
        feedback:
          'Screen sharing shows everything on your screen. Only share with someone you contacted and trust.',
      },
      {
        id: 'b',
        text: 'Say no, and get a trusted adult if you think you need help.',
        correct: true,
        feedback:
          'Exactly. Screen sharing is powerful. Never start it for a site that reached out to you first.',
      },
      {
        id: 'c',
        text: 'Share only a blank tab to be safe.',
        correct: false,
        feedback:
          'It is better not to start screen sharing at all with an unexpected request. Decline it.',
      },
    ],
    takeaway: 'Screen sharing shows everything. Only share with someone you chose and trust.',
  },
  {
    id: 'connect-friends-app',
    category: 'privacy',
    title: 'A game wants your friends list',
    intro: 'A new game asks to see your contacts and friends to "find players".',
    example: 'Allow access to your contacts?',
    exampleDetail: 'You can invite friends inside the game without this.',
    question: 'What is the safer choice?',
    answers: [
      {
        id: 'a',
        text: 'Allow it so you can find friends fast.',
        correct: false,
        feedback:
          'Sharing your contacts shares other people’s details too — they never agreed to that. It is a big permission for a small convenience.',
      },
      {
        id: 'b',
        text: 'Say no. You can add friends inside the game instead.',
        correct: true,
        feedback:
          'Right. Your contacts include other people’s information. There is usually a way to invite friends without handing over your list.',
      },
      {
        id: 'c',
        text: 'Allow it, then turn it off later.',
        correct: false,
        feedback:
          'By then your contacts may already have been copied. Better not to share them in the first place.',
      },
    ],
    takeaway: 'Your contacts include other people’s details. Share them only when you truly must.',
  },
  {
    id: 'terms-and-conditions',
    category: 'privacy',
    title: 'A huge "terms and conditions" box',
    intro: 'A site shows a very long terms page and a single "I agree" button.',
    example: 'By continuing you agree to our terms and privacy policy',
    exampleDetail: 'You cannot see what you are agreeing to.',
    question: 'What is the sensible habit?',
    answers: [
      {
        id: 'a',
        text: 'Always click agree without reading.',
        correct: false,
        feedback:
          'You cannot know what you are agreeing to. For sites that ask for personal details, it is worth checking.',
      },
      {
        id: 'b',
        text: 'For sites that ask for personal details, look for a plain-language summary or ask an adult.',
        correct: true,
        feedback:
          'Right. You do not have to read every word, but before sharing personal details it is worth knowing the basics.',
      },
      {
        id: 'c',
        text: 'Never use any website with terms.',
        correct: false,
        feedback:
          'Almost every site has terms, so that is not practical. The habit is to pause before sharing personal details.',
      },
    ],
    takeaway: 'You cannot agree to what you cannot see. Pause before sharing personal details.',
  },

  /* --------------------- more shopping & money --------------------------- */
  {
    id: 'fake-charity',
    category: 'shopping',
    title: 'A message asking for charity donations',
    intro: 'A message urges you to donate to a cause through a link.',
    example: 'Donate now to help — every second counts!',
    exampleDetail: 'You cannot tell who is collecting the money.',
    question: 'What is the safest response?',
    answers: [
      {
        id: 'a',
        text: 'Donate straight away — it is for a good cause.',
        correct: false,
        feedback:
          'Wanting to help is kind, but the money may not reach anyone. Urgent messages are often fake charities.',
      },
      {
        id: 'b',
        text: 'Do not donate through the message. Check the real charity with an adult first.',
        correct: true,
        feedback:
          'Exactly. Real charities can be found directly. Never donate through a link someone sent you.',
      },
      {
        id: 'c',
        text: 'Donate a small amount to be safe.',
        correct: false,
        feedback:
          'Any amount still goes to whoever set up the link, and it confirms your details are active.',
      },
    ],
    takeaway: 'Give through a charity you found yourself, never through a message link.',
  },
  {
    id: 'gift-card-request',
    category: 'shopping',
    title: 'Someone asks for gift cards',
    intro: 'A message claims to be from a company and asks you to pay with gift cards.',
    example: 'Pay the fee with 100 in gift cards and send the codes.',
    exampleDetail: 'Real companies never ask to be paid in gift cards.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Buy the cards and send the codes.',
        correct: false,
        feedback:
          'Gift cards are like cash — once the codes are sent, the money is gone. This is a very common trick.',
      },
      {
        id: 'b',
        text: 'Stop. No real company or person should ask to be paid in gift cards.',
        correct: true,
        feedback:
          'Right. Gift-card payment requests are a warning sign. Tell a trusted adult.',
      },
      {
        id: 'c',
        text: 'Send the codes but keep the receipts.',
        correct: false,
        feedback:
          'Receipts do not get the money back once the codes are used. Do not send them at all.',
      },
    ],
    takeaway: 'Nobody real asks to be paid in gift cards. That request alone is a warning sign.',
  },
  {
    id: 'refund-scam',
    category: 'shopping',
    title: 'A "refund" that needs your details',
    intro: 'Someone offers you a refund but needs your account details to send it.',
    example: 'To refund you, log in here and confirm your card number.',
    exampleDetail: 'You were not expecting a refund.',
    question: 'What is the safest choice?',
    answers: [
      {
        id: 'a',
        text: 'Log in and give the details to get the refund.',
        correct: false,
        feedback:
          'A real refund never needs your card number again. This is a way to collect your details.',
      },
      {
        id: 'b',
        text: 'Do not give details. Check with the real company yourself or ask an adult.',
        correct: true,
        feedback:
          'Exactly. Reach the company directly if you are unsure. Never confirm card details through a message.',
      },
      {
        id: 'c',
        text: 'Give only the last few digits of the card.',
        correct: false,
        feedback:
          'Even part of your details is useful to a scammer, and they can ask for more. Share none of it.',
      },
    ],
    takeaway: 'A real refund never needs your details again. Check with the company yourself.',
  },

  /* --------------------- more messages & people -------------------------- */
  {
    id: 'impersonation',
    category: 'social',
    title: 'A message from a "teacher" or "coach"',
    intro: 'A message claims to be from a teacher, asking for something unusual.',
    example: '"It’s your teacher — send me your login for the school portal."',
    exampleDetail: 'The message arrives from an account you do not recognise.',
    question: 'What is the safest response?',
    answers: [
      {
        id: 'a',
        text: 'Send the login — teachers are allowed to ask.',
        correct: false,
        feedback:
          'A real teacher would not ask for your password by message. Anyone can copy a name and photo.',
      },
      {
        id: 'b',
        text: 'Do not send anything. Check in person or with a trusted adult.',
        correct: true,
        feedback:
          'Right. Verify through a person or route you trust. Passwords are never shared over messages, even by "teachers".',
      },
      {
        id: 'c',
        text: 'Send it but only the username.',
        correct: false,
        feedback:
          'Even the username helps an attacker. Do not reply with account details at all.',
      },
    ],
    takeaway: 'Anyone can copy a name and photo. Verify important requests in person.',
  },
  {
    id: 'meet-up-stranger',
    category: 'social',
    title: 'Someone online wants to meet up',
    intro: 'A person you only know online asks to meet in real life.',
    example: '"Let’s meet after school — don’t tell anyone, it’s our secret."',
    exampleDetail: 'They say not to tell anyone.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Meet them but bring a friend.',
        correct: false,
        feedback:
          'Never meet someone you only know online. Asking for secrecy is a serious warning sign.',
      },
      {
        id: 'b',
        text: 'Do not meet them. Tell a trusted adult straight away.',
        correct: true,
        feedback:
          'Exactly right. Secrecy plus meeting up is a serious danger sign. Telling an adult is the safe move.',
      },
      {
        id: 'c',
        text: 'Keep chatting but agree not to meet.',
        correct: false,
        feedback:
          'Still tell an adult. A request for secrecy about meeting up should always be shared with someone you trust.',
      },
    ],
    takeaway: 'Never meet an online-only friend. "Don’t tell anyone" is a serious warning sign.',
  },
  {
    id: 'threat-message',
    category: 'social',
    title: 'A message threatens you',
    intro: 'Someone online threatens to share something unless you do what they say.',
    example: '"Send money or I’ll tell everyone something about you."',
    exampleDetail: 'They are trying to scare you into paying.',
    question: 'What is the safest response?',
    answers: [
      {
        id: 'a',
        text: 'Pay them so they stop.',
        correct: false,
        feedback:
          'Paying rarely makes it stop, and it tells them you will pay. This is a common trick.',
      },
      {
        id: 'b',
        text: 'Do not pay. Block them and tell a trusted adult right away.',
        correct: true,
        feedback:
          'Right. You have done nothing wrong. Blocking and telling an adult is the correct step — you are not alone in this.',
      },
      {
        id: 'c',
        text: 'Reply angrily and argue with them.',
        correct: false,
        feedback:
          'Arguing keeps them talking. Block them and involve an adult instead.',
      },
    ],
    takeaway: 'If someone threatens you, do not pay. Block them and tell an adult — you are not in trouble.',
  },
  {
    id: 'fake-giveaway-dm',
    category: 'social',
    title: 'A direct message says you won',
    intro: 'A direct message says you won a prize and must claim it fast.',
    example: '"You won! Claim within 1 hour or it goes to someone else."',
    exampleDetail: 'It asks for your address to "deliver" the prize.',
    question: 'What is the safest choice?',
    answers: [
      {
        id: 'a',
        text: 'Claim it and send your address quickly.',
        correct: false,
        feedback:
          'A real prize does not come from a message you never entered. The countdown is there to rush you.',
      },
      {
        id: 'b',
        text: 'Do not reply or send details. You did not enter anything, so you did not win anything.',
        correct: true,
        feedback:
          'Exactly. If you never entered, you cannot have won. Do not send your address or reply.',
      },
      {
        id: 'c',
        text: 'Send only your first name to test it.',
        correct: false,
        feedback:
          'Replying confirms your account is active and starts the conversation. Better not to reply at all.',
      },
    ],
    takeaway: 'You cannot win a prize you never entered. Urgency plus a request for details is a trick.',
  },
  {
    id: 'two-factor-fatigue',
    category: 'social',
    title: 'Your phone keeps buzzing with login codes',
    intro: 'You suddenly get several login codes you did not ask for.',
    example: 'Your code is 448210 — do not share it with anyone.',
    exampleDetail: 'Someone is trying to sign in to your account.',
    question: 'What should you do?',
    answers: [
      {
        id: 'a',
        text: 'Share the code with whoever is asking.',
        correct: false,
        feedback:
          'That code is the key to your account. The message itself tells you not to share it — and it means it.',
      },
      {
        id: 'b',
        text: 'Do not share any code. Change your password and tell a trusted adult.',
        correct: true,
        feedback:
          'Right. Unexpected codes mean someone is trying to get in. Keep the codes private, change your password, and get help.',
      },
      {
        id: 'c',
        text: 'Ignore all codes and hope it stops.',
        correct: false,
        feedback:
          'Ignoring the codes is better than sharing them, but you should also change your password and tell an adult.',
      },
    ],
    takeaway: 'Codes you did not ask for mean someone is trying to get in. Never share them — change your password.',
  },
];

/** Every scenario available for practice, required ones first. */
export const ALL_SCENARIOS: CoachScenario[] = [...SCENARIOS, ...PRACTICE_SCENARIOS];

/** How many scenarios make up one round. */
export const ROUND_SIZE = 5;

export interface CoachRound {
  id: string;
  scenarioIds: string[];
}

function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = arr[i] as T;
    const b = arr[j] as T;
    arr[i] = b;
    arr[j] = a;
  }
  return arr;
}

/**
 * Build a round of scenarios.
 *
 * - Round 1 always contains the five required scenarios, so the core teaching
 *   points are guaranteed to appear first.
 * - Later rounds are drawn at random from the whole bank, preferring topics not
 *   used in the previous round so consecutive rounds feel different.
 * - The result is de-duplicated and padded from the remaining pool, so a round
 *   is only ever as short as the bank itself.
 */
export function buildRound(previous?: CoachRound | null): CoachRound {
  const requiredIds = SCENARIOS.map((s) => s.id);

  if (!previous) {
    return { id: `round-${Date.now()}`, scenarioIds: shuffled(requiredIds) };
  }

  const prevCats = new Set(
    previous.scenarioIds
      .map((id) => scenarioById(id)?.category)
      .filter((c): c is CoachCategory => Boolean(c)),
  );

  const fresh = shuffled(
    ALL_SCENARIOS.filter((s) => !previous.scenarioIds.includes(s.id) && !prevCats.has(s.category)),
  );
  const rest = shuffled(
    ALL_SCENARIOS.filter((s) => !previous.scenarioIds.includes(s.id) && prevCats.has(s.category)),
  );

  const pool = [...fresh, ...rest];
  const chosen: CoachScenario[] = [];
  const usedCats = new Set<CoachCategory>();

  for (const s of pool) {
    if (chosen.length >= ROUND_SIZE) break;
    if (usedCats.has(s.category)) continue;
    chosen.push(s);
    usedCats.add(s.category);
  }
  for (const s of pool) {
    if (chosen.length >= ROUND_SIZE) break;
    if (!chosen.includes(s)) chosen.push(s);
  }

  return { id: `round-${Date.now()}`, scenarioIds: chosen.map((s) => s.id) };
}

/** The full round-1 order, used to keep the required topics first. */
export function roundOneScenarioIds(): string[] {
  return shuffled(SCENARIOS.map((s) => s.id));
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
