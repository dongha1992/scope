import { useState } from "react";
import Button from "../Common/Button";
import TextArea from "../Common/TextArea";
import Input from "../Common/Input";
import { SearchActiveIcon } from "@/utils/svg";
import ImageBox from "../Common/ImageBox";

export default function NewBookPostForm({ onSubmit, className = "" }: any) {
  const [images, setImages] = useState<Array<string>>([]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { text } = e.target.elements;
    onSubmit({ body: text.value, text: "" });
  };

  const setImageHandler = (image: any) => {
    console.log(typeof image);
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
        <Input
          className="mb-6"
          left={<SearchActiveIcon />}
          name="search"
          button={<Button className="w-16 p-2 m-0">검색</Button>}
        />
        <TextArea className="h-96" name="text" />
        <ImageBox setImageValue={setImageHandler} />
        <div>
          <Button type="submit">제출</Button>
        </div>
      </div>
    </form>
  );
}
