import Link from "next/link";
import { useRecoilState } from "recoil";
import Image from "next/image";

import { BOOK_QUERY_KEY, useDeletePost } from "@/query/book";
import { useSession } from "next-auth/react";
import router from "next/router";
import PostActions from "../PostActions";
import Setting from "../Common/Setting";
import Spacing from "../Common/Spacing";

import { imageZoomState, popupState } from "@/store/common";
import useRating from "@/hooks/useRating";

//TODO: 서버에서 받은 이미지 포맷 함수

const MAX_BODY_LENGTH = 100;

export default function NovelPost({
  onLike,
  onComment,
  onShare,
  href,
  novel,
  user,
  className = "",
}: any) {
  const [popup, setPopup] = useRecoilState(popupState);
  const [srcs, setSrcs] = useRecoilState(imageZoomState);

  const { status, data } = useSession();
  const { ratingGenerator } = useRating({ userRating: novel.rating });

  const NOVEL_QUERY_KEY = "";

  const { mutate: deletePostMutation } = useDeletePost({
    queryKey: [NOVEL_QUERY_KEY],
  });

  const onDeleteHandler = (e: any) => {
    e.preventDefault();
    setPopup({
      message: "정말 삭제하시겠어요?",
      callback: () => onClickConfirm(),
      isOpen: true,
    });
  };

  const onEditHandler = (e: any) => {
    e.preventDefault();
    router.push(`/novelForm/${novel.id}`);
  };

  const onClickConfirm = () => {
    deletePostMutation(novel.id);
  };

  const isAuth = data?.user?.email === novel.user.email;

  return (
    <>
      <div className={"flex flex-col rounded-lg shadow-lg " + className}>
        <Link href={href}>
          <div className="flex flex-1 flex-col justify-between">
            <div className="mt-2 mb-2 flex items-center ">
              <div className="flex-shrink-0 text-gray-100">
                {user?.image && (
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={user.image}
                    width={10}
                    height={10}
                    alt="아바타 사진"
                  />
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-100">
                    {/* {formatUserName(user?.name)} */}
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-300">
                    {novel?.createdAt.split("T")[0]}
                  </p>
                </div>
                <div className="flex mt-1 items-center justify-between">
                  <p className="text-sm font-semibold text-gray-100 break-all">
                    {novel?.title ? `<${novel?.title}>` : ""}
                  </p>
                  {isAuth && (
                    <Setting
                      onDelete={onDeleteHandler}
                      onEdit={onEditHandler}
                      className="top-5 right-0"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end w-full my-2">
              {ratingGenerator()}
            </div>
          </div>
        </Link>
        <Spacing size={20} />
        <div className="flex flex-col items-center pb-3 pt-2">
          <PostActions
            onComment={onComment}
            onLike={onLike}
            onShare={onShare}
            isLiked={novel?.isLiked}
            totalComments={novel?.totalComments}
            totalLikes={novel?.totalLikes}
          />
        </div>
      </div>
    </>
  );
}