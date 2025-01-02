'use client'
import React, { useState } from "react";

import { Highlight, themes } from "prism-react-renderer";
import { CheckIcon, ClipboardIcon } from "lucide-react";

export const CodeSnippet = ({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 rounded bg-gray-700 px-2 py-1 text-sm text-white hover:bg-gray-600"
      >
        {copied ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <ClipboardIcon className="w-4 h-4" />
        )}
      </button>
      <Highlight theme={themes.okaidia} code={code} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={style} className="overflow-scroll p-2">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};
