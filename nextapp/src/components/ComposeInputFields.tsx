import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
type generatedTextType = { subject: string; body: string };

function ComposeInputFields({
  setReceiver,
  receiver,
  isLoading,
  setGeneratedText,
  generatedText,
  setPrompt,
  prompt,
  handleGenerateResponse,
}: {
  setReceiver: any;
  receiver: string;
  isLoading: boolean;
  setGeneratedText: any;
  generatedText: generatedTextType;
  setPrompt: any;
  handleGenerateResponse: any;
  prompt: string;
}) {
  return (
    <div className="flex-1 grid grid-cols-1 grid-rows-[auto,auto,1fr,auto] gap-4 p-4 overflow-y-auto">
      <Input
        className="border border-gray-300 placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-[50%]"
        placeholder="Receiver Email"
        onChange={(e) => setReceiver(e.target.value)}
        value={receiver}
        disabled={isLoading}
      />

      <Input
        className="border border-gray-300 placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-[50%]"
        onChange={(e) =>
          setGeneratedText((cur: generatedTextType) => ({
            ...cur,
            subject: e.target.value,
          }))
        }
        placeholder="Subject"
        value={generatedText.subject}
        disabled={isLoading}
      />
      <Textarea
        className="overflow-y-scroll border border-gray-300 placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-[50%]"
        placeholder="Body..."
        rows={10}
        onChange={(e) =>
          setGeneratedText((curObj: any) => ({
            ...curObj,
            body: e.target.value,
          }))
        }
        value={generatedText.body}
        disabled={isLoading}
      />
      <div className="flex gap-2">
        <Input
          className="rounded-full border border-gray-700 p-4 w-full disabled:cursor-not-allowed disabled:opacity-[50%]"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          placeholder="Add extra instructions"
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <Button
            className="rounded-full  disabled:cursor-not-allowed disabled:opacity-[50%]"
            onClick={() => handleGenerateResponse()}
            disabled={isLoading}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ComposeInputFields;
