import SendButton from "./SendButton";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

function GenerateCustomizationOptions({
  setReqBody,
  setIsEnabled,
  handleSend,
  isLoading,
}: any) {
  return (
    <div className="w-full grid grid-cols-1  md:w-64 border-b md:border-b-0 md:border-r border-gray-300 p-2 my-4 mx-2">
      <div className=" space-y-6 p-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compose Language
          </label>
          <Select
            onValueChange={(e) =>
              setReqBody((cur: any) => {
                return { ...cur, compose_language: e };
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="marathi">Marathi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Writting style
          </label>
          <Select
            onValueChange={(e) =>
              setReqBody((cur: any) => {
                return { ...cur, response_writing_style: e };
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select writting style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aggresive">Aggresive</SelectItem>
              <SelectItem value="passive">Passive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tone
          </label>
          <Select
            onValueChange={(e) =>
              setReqBody((cur: any) => {
                return { ...cur, response_tone: e };
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="offical">Offical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Length
          </label>
          <Select
            onValueChange={(e) =>
              setReqBody((cur: any) => {
                return { ...cur, length: e };
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            onClick={() => {
              setIsEnabled((cur: any) => {
                return !cur;
              });
            }}
            className="text"
            id="custom-knowledge"
          />
          <Label htmlFor="custom-knowledge" className="text-gray-650">
            Use Custom Knowledge
          </Label>
        </div>
      </div>
      <SendButton handleSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

export default GenerateCustomizationOptions;
