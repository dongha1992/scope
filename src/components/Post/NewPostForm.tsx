import { useState } from "react";
import SimpleCodeEditor from "../Editor";
import Button from "../Button";
import LanguageDropdown from "./LanguageDropdown";

export default function NewPostForm({
  defaultLanguage = "markdown",
  defaultCode = "",
  onSubmit,
  onChange,
  className = "",
}: any) {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState(defaultLanguage);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({ code, language });
  };

  const handleChange = (value: any) => {
    setCode(value);
    onChange?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      action="#"
      method="POST"
    >
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <LanguageDropdown
            // buttonClassName="rounded-none rounded-t-xl"
            // optionsClassName="rounded-none rounded-b-xl"
            optionsClassName="mt-1"
            language={language}
            onChange={setLanguage}
          />
          <SimpleCodeEditor
            // className="rounded-none rounded-b-xl"
            className="mt-5"
            value={code}
            onChange={handleChange}
            language={language}
            id="code"
            name="code"
          />
          <Button type="submit">제출</Button>
        </div>
      </div>
    </form>
  );
}