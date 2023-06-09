import Link from "next/link";
import { useRecoilState } from "recoil";
import Image from "next/image";

import formatTimeAgo from "@/utils/formatTimeAgo";
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

export default function BookPost({
  onLike,
  onComment,
  onShare,
  href,
  book,
  user,
  className = "",
}: any) {
  const [popup, setPopup] = useRecoilState(popupState);
  const [srcs, setSrcs] = useRecoilState(imageZoomState);

  const { status, data } = useSession();
  const { ratingGenerator } = useRating({ userRating: book.rating });

  const { mutate: deletePostMutation } = useDeletePost({
    queryKey: [BOOK_QUERY_KEY],
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
    router.push(`/bookForm/${book.id}`);
  };

  const onClickConfirm = () => {
    deletePostMutation(book.id);
  };

  const isAuth = data?.user?.email === book.user.email;

  return (
    <>
      <div className={"flex flex-col rounded-lg shadow-lg " + className}>
        <div className="flex flex-1 flex-col justify-between">
          <div className="mt-2 mb-2 flex items-center ">
            <div className="relative h-10 w-10 flex-shrink-0">
              {user?.image && (
                <Image
                  className="rounded-full"
                  src={user.image}
                  fill
                  style={{ objectFit: "cover" }}
                  alt="아바타 사진"
                />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-100">
                  {user?.name || "익명의 유저"}
                </p>
                <p className="text-xs text-gray-300">
                  {book?.createdAt.split("T")[0]}
                </p>
              </div>
              <div className="flex mt-1 items-center justify-between">
                <p className="text-sm md:text-md lg:text-md font-semibold text-gray-100 break-all">
                  {book?.title ? `<${book?.title}>` : ""}
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
          <Link href={href}>
            <span className="text-sm md:text-lg lg:text-lg text-gray-100 whitespace-pre-wrap break-words">
              {book?.body.length > MAX_BODY_LENGTH
                ? book?.body.slice(0, MAX_BODY_LENGTH) + "..."
                : book?.body}
            </span>
          </Link>
        </div>
        <Spacing size={20} />
        <section className="overflow-x-scroll">
          <div
            className="flex align-items-center gap-4"
            style={{ width: `${book?.userImages.length * 192}px` }}
          >
            {book?.userImages.length > 0 &&
              book?.userImages.map((src: string, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-48 h-48"
                    onClick={() =>
                      setSrcs({
                        srcs: book?.userImages,
                        startIndex: index,
                      })
                    }
                  >
                    <Image
                      src={src}
                      alt="스크린샷"
                      className="rounded"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                );
              })}
          </div>
        </section>
        <div className="flex flex-col items-center pb-3 pt-2">
          <PostActions
            onComment={onComment}
            onLike={onLike}
            onShare={onShare}
            isLiked={book?.isLiked}
            totalComments={book?.totalComments}
            totalLikes={book?.totalLikes}
          />
        </div>
      </div>
    </>
  );
}
