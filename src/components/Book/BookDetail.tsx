import Image from "next/image";
import { useSession } from "next-auth/react";
import router from "next/router";

import formatTimeAgo from "@/utils/formatTimeAgo";
import { BOOK_QUERY_KEY, useDeletePost } from "@/query/book";
import PostActions from "../PostActions";
import Setting from "../Common/Setting";
import { formatUserName } from "@/utils/maskString";
import BookInfo from "./BookInfo";
import Spacing from "../Common/Spacing";
import useRating from "@/hooks/useRating";
import { imageZoomState, popupState } from "@/store/common";
import { useRecoilState } from "recoil";

export default function BookDetail({
  onLike,
  onComment,
  onShare,
  book,
  user,
  className = "",
}: any) {
  const { status, data } = useSession();
  const [popup, setPopup] = useRecoilState(popupState);
  const [srcs, setSrcs] = useRecoilState(imageZoomState);

  const { ratingGenerator } = useRating({ userRating: book?.rating });

  const { mutateAsync: deletePostMutation } = useDeletePost({
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
    deletePostMutation(book.id).then((res) => {
      if (res.status === 200) {
        router.push("/book");
      }
    });
  };

  const isAuth = data?.user?.email === book?.user?.email;
  const hasBookInfo = book?.image || book?.author;

  return (
    <div className={"flex flex-col overflow-hidden rounded-lg " + className}>
      <div className="flex flex-1 flex-col justify-between">
        <div className="mt-2 flex items-center">
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
                {/* {formatUserName(user?.name)} */}
                {user?.name || "익명의 유저"}
              </p>
              <p className="text-xs text-gray-300">
                {book?.createdAt.split("T")[0]}
              </p>
            </div>
            <div className="flex mt-1 items-center justify-between">
              <p className="text-md font-semibold text-gray-100 break-all">
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
        <div className="flex justify-end w-full my-2">{ratingGenerator()}</div>
        {hasBookInfo && (
          <div className="flex flex-col mt-4">
            <BookInfo item={book} withTitle={false} isDetail />
          </div>
        )}
        <span className="mt-4 text-sm md:text-lg lg:text-lg text-gray-100 whitespace-pre-wrap break-words">
          {book?.body ?? ""}
        </span>
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
                  className="relative w-48 h-48 object-contain"
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
                    fill
                    className="rounded"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              );
            })}
        </div>
      </section>
      <Spacing size={10} />
      <div className="flex flex-col items-center">
        <PostActions
          onComment={onComment}
          onLike={onLike}
          onShare={onShare}
          isLiked={book?.isLiked}
          totalComments={book?.totalComments}
          totalLikes={book?.totalLikes}
        />
      </div>
      <Spacing size={10} />
    </div>
  );
}
