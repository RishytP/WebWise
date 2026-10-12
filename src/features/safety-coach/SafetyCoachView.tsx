import { useMemo, useRef, useState, type ReactElement } from 'react';
import type { CookieReport, PageContext, PermissionReport } from '../../types';
import { SCENARIOS, contextualTips, isCorrectAnswer } from './scenarios';
import { Card, Confetti, Pill } from '../../popup/components/Primitives';
import {
  Pip,
  IconBulb,
  IconCheck,
  IconCompass,
  IconInfo,
  IconStar,
  IconAlert,
} from '../../popup/components/Icons';

interface Attempt {
  answerId: string;
  correct: boolean;
}

export function SafetyCoachView({
  context,
  cookieReport,
  permissionReport,
}: {
  context: PageContext;
  cookieReport: CookieReport | null;
  permissionReport: PermissionReport | null;
}): ReactElement {
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});
  const [streak, setStreak] = useState(0);
  const [celebrate, setCelebrate] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[index];
  const attempt = scenario ? attempts[scenario.id] : undefined;

  const solved = Object.values(attempts).filter((a) => a.correct).length;
  const answered = Object.keys(attempts).length;

  const tips = useMemo(
    () =>
      contextualTips({
        cookieSummary:
          cookieReport && cookieReport.status === 'ok'
            ? {
                total: cookieReport.summary.total,
                httpOnly: cookieReport.summary.httpOnly,
                thirdParty: cookieReport.summary.thirdParty,
                persistent: cookieReport.summary.persistent,
              }
            : null,
        permissionFindings:
          permissionReport && permissionReport.status === 'ok'
            ? permissionReport.findings.map((f) => ({ name: f.name, state: f.state }))
            : null,
      }),
    [cookieReport, permissionReport],
  );

  if (!scenario) return <p>No scenarios are available.</p>;

  const choose = (answerId: string) => {
    if (attempt) return;
    const correct = isCorrectAnswer(scenario, answerId);
    setAttempts((prev) => ({ ...prev, [scenario.id]: { answerId, correct } }));
    if (correct) {
      setStreak((s) => s + 1);
      setCelebrate((c) => c + 1);
    } else {
      setStreak(0);
    }
  };

  const tryAgain = () => {
    setAttempts((prev) => {
      const next = { ...prev };
      delete next[scenario.id];
      return next;
    });
  };

  const chosenAnswer = attempt ? scenario.answers.find((a) => a.id === attempt.answerId) : undefined;
  const allDone = answered === SCENARIOS.length;

  return (
    <div className="ww-stack" ref={wrapRef} style={{ position: 'relative' }}>
      {celebrate > 0 && attempt?.correct && <Confetti seed={celebrate} />}

      <div className="ww-hero">
        <Pip size={50} mood={attempt?.correct ? 'happy' : 'curious'} />
        <div className="ww-hero__text">
          <h1 className="ww-hero__host" style={{ fontSize: 19 }}>
            Safety Coach
          </h1>
          <p className="ww-small ww-muted" style={{ margin: '4px 0 0' }}>
            Build your scam-spotting instinct. Nothing here visits a real site.
          </p>
        </div>
      </div>

      {/* Score meter */}
      <div className="ww-scoremeter">
        <span className="ww-scoremeter__flame" aria-hidden="true">
          {streak > 0 ? '🔥' : '✨'}
        </span>
        <span>{streak > 0 ? `${streak} in a row!` : 'Give it a go'}</span>
        <span className="ww-scoremeter__bar" aria-hidden="true">
          <span className="ww-scoremeter__fill" style={{ width: `${(solved / SCENARIOS.length) * 100}%` }} />
        </span>
        <span className="ww-row" style={{ gap: 4 }}>
          <IconStar size={14} />
          {solved}/{SCENARIOS.length}
        </span>
      </div>

      <Card badge={`${index + 1} of ${SCENARIOS.length}`} icon={<IconCompass size={18} />}>
        <div className="ww-coach__progress" role="tablist" aria-label="Scenarios">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Scenario ${i + 1}: ${s.title}`}
              className={`ww-coach__dot${i === index ? ' ww-coach__dot--current' : ''}${
                attempts[s.id]?.correct ? ' ww-coach__dot--done' : ''
              }`}
              onClick={() => setIndex(i)}
            >
              {attempts[s.id]?.correct ? '' : i + 1}
            </button>
          ))}
        </div>

        <h3 className="ww-card__title" style={{ fontSize: 16, marginBottom: 4 }}>
          {scenario.title}
        </h3>
        <p className="ww-perm__text">{scenario.intro}</p>

        <div className="ww-example">
          {scenario.example}
          {scenario.exampleDetail && <div className="ww-example__detail">{scenario.exampleDetail}</div>}
        </div>

        <p className="ww-strong" style={{ fontSize: 13.5, margin: '14px 0 8px' }}>
          {scenario.question}
        </p>

        <div role="group" aria-label="Answers">
          {scenario.answers.map((a, i) => {
            let cls = 'ww-answer';
            if (attempt) {
              cls += ' ww-answer--disabled';
              if (a.id === attempt.answerId) cls += a.correct ? ' ww-answer--correct' : ' ww-answer--wrong';
              else if (a.correct) cls += ' ww-answer--correct';
            }
            return (
              <button key={a.id} type="button" className={cls} disabled={Boolean(attempt)} onClick={() => choose(a.id)}>
                <span className="ww-answer__key">{String.fromCharCode(65 + i)}</span>
                <span>{a.text}</span>
              </button>
            );
          })}
        </div>

        {attempt && chosenAnswer && (
          <>
            <div className={`ww-feedback${attempt.correct ? ' ww-feedback--good' : ' ww-feedback--retry'}`}>
              <span className="ww-feedback__icon" aria-hidden="true">
                {attempt.correct ? <IconCheck size={18} /> : <IconAlert size={18} />}
              </span>
              <div>
                <strong>{attempt.correct ? 'Nice — that is the safer choice. ' : 'Not quite. '}</strong>
                {chosenAnswer.feedback}
                {!attempt.correct && (
                  <>
                    {' '}
                    <em>The safest option was: “{scenario.answers.find((a) => a.correct)?.text}”</em>
                  </>
                )}
              </div>
            </div>

            <div className="ww-takeaway">
              <span aria-hidden="true" style={{ flex: 'none' }}>
                <IconBulb size={18} />
              </span>
              <span>
                <strong>Takeaway: </strong>
                {scenario.takeaway}
              </span>
            </div>

            <div className="ww-row" style={{ marginTop: 12, gap: 8 }}>
              <button type="button" className="ww-btn" onClick={tryAgain}>
                Try again
              </button>
              {index < SCENARIOS.length - 1 && (
                <button type="button" className="ww-btn ww-btn--primary" onClick={() => setIndex(index + 1)}>
                  Next scenario
                </button>
              )}
            </div>
          </>
        )}
      </Card>

      {allDone && (
        <Card>
          <div className="ww-row" style={{ gap: 12 }}>
            <Pip size={48} mood="happy" />
            <div>
              <p className="ww-card__title" style={{ marginBottom: 2 }}>
                You finished all five challenges!
              </p>
              <p className="ww-small ww-muted" style={{ margin: 0 }}>
                You solved {solved} of {SCENARIOS.length}. Replay any one any time to keep your instinct sharp.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card title="Tips for this page" subtitle={context.hostname ? `Based on what we found on ${context.hostname}` : 'General tips'} icon={<IconBulb size={18} />}>
        {tips.map((tip) => (
          <div className="ww-tip" key={tip.id}>
            <span aria-hidden="true" style={{ color: 'var(--ww-coral)', flexShrink: 0 }}>
              <IconInfo size={16} />
            </span>
            <div>
              <p className="ww-tip__title">{tip.title}</p>
              <p className="ww-tip__body">{tip.body}</p>
            </div>
          </div>
        ))}
      </Card>

      <Card title="A note about judging websites" icon={<IconInfo size={18} />}>
        <p className="ww-perm__text" style={{ marginBottom: 0 }}>
          WebWise will not label a site “safe” or “dangerous”. A site with no warnings today can still change, and a
          warning is a reason to look closer, not proof of harm. Check the address, think about what a page asks for,
          and ask a trusted adult whenever something feels off.
        </p>
      </Card>

      <p className="ww-footnote">
        <Pill tone="muted">Educational only</Pill> These scenarios are invented examples for practice.
      </p>
    </div>
  );
}
