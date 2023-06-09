import React, { PropsWithChildren, useState } from "react";
import useBodyLock from "@/hooks/useBodyLock";

import { CancelIcon } from "@/utils/svg";
import Carousel from "./Carousel";
import { imageZoomState } from "@/store/common";
import { useRecoilState } from "recoil";
import Spacing from "./Common/Spacing";
import { getZIndex } from "@/utils/getZIndex";
interface IProps {
  images: string[];
  startIndex?: number;
}

const ImageViewer = ({ images = [], startIndex = 0 }: IProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(startIndex);

  const [srcs, setSrcs] = useRecoilState(imageZoomState);

  const onChange = (changedIndex: number) => {
    setCurrentImageIndex(changedIndex);
  };

  const closeModal = () => {
    setSrcs(null);
  };

  return (
    <ModalFullScreen>
      <section className="relative h-screen flex items-center flex-col px-6">
        <Spacing size={30} />
        <div className="flex items-center justify-between w-full mb-2 mt-2">
          <div />
          <span className="text-white">
            {currentImageIndex + 1} / {images.length}
          </span>
          <div onClick={closeModal}>
            <CancelIcon />
          </div>
        </div>
        <Carousel
          images={images}
          initialSlide={startIndex}
          onChange={onChange}
        />
      </section>
    </ModalFullScreen>
  );
};

export default React.memo(ImageViewer);

const ModalFullScreen = ({ children }: PropsWithChildren) => {
  useBodyLock();
  const handleClickDimmer = ({ target, currentTarget }: any) => {
    if (target !== currentTarget) {
      return;
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center bg-black`}
      style={{ zIndex: getZIndex("fullScreen") }}
      onClick={handleClickDimmer}
    >
      <div className={"relative max-w-screen-md w-full z-10 box-border"}>
        {children}
      </div>
    </div>
  );
};
