import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import {
  BOOK_DETAIL_QUERY_KEY,
  useEditPost,
  useGetBookDetail,
} from "@/query/book";
import Overlay from "@/components/Common/Overlay";
import Lottie from "@/components/Common/Lottie";
import { getBookDetailApi } from "@/utils/api/book";
import NewBookPostForm from "@/components/Book/NewBookPostForm";
import BookInfo from "@/components/Book/BookInfo";
import useRating from "@/hooks/useRating";
import Layout from "@/components/Layout";
import { Header } from "@/components/Common/Header";

export default function BookEditPage() {
  const [images, setImages] = useState<any>([]);
  const router = useRouter();

  const { id } = router.query;

  const { data: book, isLoading, isError } = useGetBookDetail(Number(id));
  const { ratingGenerator, rating } = useRating({
    userRating: book?.rating,
    isReadOnly: false,
  });

  const { mutate: patchPostMutation, isLoading: postLoading } = useEditPost({
    queryKey: [BOOK_DETAIL_QUERY_KEY, id],
  });

  const removeImageHandler = (index: number) => {
    setImages((prev: any) =>
      prev.filter((_: string, idx: number) => idx !== index)
    );
  };

  const onEditHandler = (e: any) => {
    e.preventDefault();
    const { text } = e.target.elements;
    if (!text.value) {
      alert("내용을 입력해주세요.");
      return;
    }

    patchPostMutation({
      data: { body: text.value, userImages: images, rating },
      id: Number(id),
    });
  };

  useEffect(() => {
    //FIXME: 이게 맞나.?
    setImages(book?.userImages);
  }, [setImages, book]);

  if (isLoading || postLoading) {
    return (
      <Overlay>
        <Lottie
          src="https://assets8.lottiefiles.com/private_files/lf30_gqirhcr7.json"
          loop={true}
        />
      </Overlay>
    );
  }

  const hasBookInfo = book?.author || book?.description;

  return (
    <>
      <Head>
        <title>책에 대하여</title>
      </Head>
      <div className="w-full pb-10 lg:pt-12 lg:pb-14 max-w-10xl mx-auto px-4 my-4">
        <h1 className="text-xl font-bold tracking-tight text-gray-100 sm:text-2xl md:text-3xl mb-6">
          어떤 책을 읽으셨나요?
        </h1>
        <div className="mt-6">
          {hasBookInfo && <BookInfo item={book} />}
          <div className="flex justify-end w-full my-2">
            {ratingGenerator({ width: 24, height: 24 })}
          </div>
          <NewBookPostForm
            className="max-w-5xl mt-4"
            onSubmit={onEditHandler}
            value={book.body}
            setImages={setImages}
            removeImageHandler={removeImageHandler}
            images={images}
          />
        </div>
      </div>
    </>
  );
}

BookEditPage.getLayout = (page: ReactElement) => {
  return <Layout top={<Header />}>{page}</Layout>;
};
