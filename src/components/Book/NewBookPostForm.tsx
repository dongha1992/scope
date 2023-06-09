import Image from "next/image";
import AWS from "aws-sdk";
import { Dispatch, SetStateAction, useState } from "react";

import Button from "../Common/Button";
import TextArea from "../Common/TextArea";
import ImageBox from "../Common/ImageBox";
import Lottie from "../Common/Lottie";
import Overlay from "../Common/Overlay";
import { CancelIcon } from "@/utils/svg";
import useS3Upload from "@/hooks/useS3Upload";

// TODO: aws 분리

const IMAGE_LIMIT = 4;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

interface Props {
  onSubmit: any;
  className: string;
  value?: string;
  images?: string[];
  setImages?: Dispatch<SetStateAction<any>>;
  removeImageHandler?: (index: number) => void;
  isLoading?: boolean;
}

export default function NewBookPostForm({
  value,
  onSubmit,
  images,
  setImages,
  removeImageHandler,
  className = "",
}: Props) {
  const { isImageLoading, setImageHandler } = useS3Upload(setImages);

  return (
    <>
      <form onSubmit={onSubmit} className={className} action="#" method="POST">
        <input type="hidden" name="remember" value="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <TextArea name="text" value={value} style={{ minHeight: "50vh" }} />
          {isImageLoading && (
            <Overlay>
              <Lottie
                className="w-56"
                src="https://assets8.lottiefiles.com/private_files/lf30_gqirhcr7.json"
                loop={true}
              />
            </Overlay>
          )}
          <section className="flex align-center pt-4 gap-3">
            {images &&
              images?.length > 0 &&
              images?.map((src, index) => {
                return (
                  <div
                    key={index}
                    tabIndex={0}
                    className={
                      "relative object-contain w-20 h-20 flex justify-center align-center rounded-md"
                    }
                  >
                    <Image src={src} alt="스크린샷" fill className="rounded" />
                    <div
                      className="absolute z-100 right-0 cursor-pointer"
                      onClick={() =>
                        removeImageHandler && removeImageHandler(index)
                      }
                    >
                      <CancelIcon width="30" height="30" />
                    </div>
                  </div>
                );
              })}
            {images && images?.length < IMAGE_LIMIT && (
              <ImageBox setImageValue={setImageHandler} />
            )}
          </section>
          <div>
            <Button type="submit">{value ? "수정" : "작성"}</Button>
          </div>
        </div>
      </form>
    </>
  );
}
