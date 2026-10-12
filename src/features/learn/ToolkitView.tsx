import { useState, type ReactElement } from 'react';
import { TOOLKIT_TOPICS } from '../safety-coach/toolkit';
import { Card } from '../../popup/components/Primitives';
import { Pip, IconChevronDown } from '../../popup/components/Icons';

/**
 * "Know the Web" — general web-safety knowledge, shown as an accordion of real
 * questions. This is explicitly educational content, not a report about the
 * current page, and is labelled as such in the UI.
 */
export function ToolkitView(): ReactElement {
  const [open, setOpen] = useState<string | null>(TOOLKIT_TOPICS[0]?.id ?? null);

  return (
    <div className="ww-stack">
      <div className="ww-hero">
        <Pip size={52} mood="curious" />
        <div className="ww-hero__text">
          <h1 className="ww-hero__host" style={{ fontSize: 19 }}>
            Know the Web
          </h1>
          <p className="ww-small ww-muted" style={{ margin: '4px 0 0' }}>
            The safety skills a browser cannot check for you. Tap a question.
          </p>
        </div>
      </div>

      <div>
        {TOOLKIT_TOPICS.map((topic, i) => {
          const isOpen = open === topic.id;
          return (
            <div className="ww-toolkit" key={topic.id} style={{ animationDelay: `${i * 35}ms` }}>
              <button
                type="button"
                className="ww-toolkit__head"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : topic.id)}
              >
                <span className="ww-toolkit__num">{i + 1}</span>
                <span className="ww-toolkit__q">{topic.question}</span>
                <span
                  style={{
                    flex: 'none',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                    display: 'grid',
                  }}
                >
                  <IconChevronDown size={18} />
                </span>
              </button>
              {isOpen && (
                <div className="ww-toolkit__body">
                  <p style={{ margin: 0 }}>{topic.answer}</p>
                  <div className="ww-toolkit__try">
                    <span className="ww-strong">Try this: </span>
                    {topic.tryThis}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Card title="A grown-up can help" subtitle="It is smart to ask, not weak">
        <p className="ww-small" style={{ margin: 0 }}>
          Nobody is expected to spot every trick alone. If something feels urgent, secretive or
          too good to be true, showing it to a trusted adult is one of the strongest moves you can
          make.
        </p>
      </Card>
    </div>
  );
}
