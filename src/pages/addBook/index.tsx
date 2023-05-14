import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Overlay from "@/components/Common/Overlay";
import Lottie from "@/components/Common/Lottie";
import NewBookPostForm from "@/components/Book/NewBookPostForm";
import { BOOK_QUERY_KEY, useBookCreate } from "@/query/book";

import { useAsync } from "@/hooks/useAsync";
import SearchBookList from "@/components/Book/SearchBookList";
import { NaverBook, NaverBooks } from "@/utils/api/type";
import { SearchActiveIcon } from "@/utils/svg";
import Input from "@/components/Common/Input";
import Button from "@/components/Common/Button";
import BookInfo from "@/components/Book/BookInfo";
import { getNaverBooksApi } from "@/utils/api/naver";

import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default function AddBookPage() {
  const router = useRouter();
  const { data, run, isLoading, setReset, isSuccess } = useAsync<
    NaverBooks,
    Error
  >();
  const { mutate, isLoading: isPostLoading } = useBookCreate({
    queryKey: [BOOK_QUERY_KEY],
  });

  const [selectedBook, setSelectedBook] = useState<NaverBook | null>(null);
  const [start, setStart] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [image, setImage] = useState<any>();
  const [isImageLoading, setImageLoading] = useState<boolean>(false);

  const totalBooksRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  totalBooksRef.current = data?.total;

  useLayoutEffect(() => {
    scrollToTop();
  }, [start]);

  useEffect(() => {
    if (start >= 1 && query) {
      run(getNaverBooksApi(query, start));
    }
  }, [query, start, run]);

  function scrollToTop() {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }

  const onSearchBookHandler = (e: any) => {
    e.preventDefault();
    const { book } = e.target.elements;

    if (!book.value) {
      alert("검색어를 입력해주세요.");
      return;
    }
    setQuery(book.value);
    setStart(1);
    setSelectedBook(null);
    run(getNaverBooksApi(book.value, start));
  };

  const onPagination = (step: string) => {
    if (step === "다음") {
      if (totalBooksRef?.current - 10 <= start) return;
      setStart((prev) => prev + 10);
    } else {
      if (start === 1) return;
      setStart((prev) => prev - 10);
    }
    // setSelectedBook(null);
  };

  const onSelectedBook = (book: NaverBook) => {
    setSelectedBook(book);
  };

  const setImageHandler = (e: any) => {
    setImage(e);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { text } = e.target.elements;
    if (!text.value) {
      alert("내용을 입력해주세요.");
      return;
    }

    let book;

    if (selectedBook) {
      const { title, ...rest } = selectedBook;
      book = rest;
    }

    // TODO: 이미지 최적화 하려면 여기서 key를 통일해줘야 함
    let imageUrl;
    if (image) {
      setImageLoading(true);

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: image.name,
        Body: image,
        ACL: "public-read",
      };

      await s3
        .upload(uploadParams)
        .promise()
        .then((res) => {
          imageUrl = res.Location;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setImageLoading(false);
        });
    }

    const data = {
      body: text.value,
      title: selectedBook?.title ?? "",
      book,
    };
    mutate(data);
    text.value = "";
  };

  if (isPostLoading)
    return (
      <Overlay>
        <Lottie className="w-20 h-20" src="/lottie/loading.json" loop={false} />
      </Overlay>
    );

  return (
    <>
      <Head>
        <title>책에 대해서</title>
      </Head>
      <div className="w-full pt-8 pb-10 lg:pt-12 lg:pb-14 max-w-10xl mx-auto px-6 my-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl md:text-4xl mb-6">
          어떤 책을 읽으셨나요?
        </h1>
        <div className="mt-6">
          {selectedBook ? (
            <div className="relative">
              <BookInfo item={selectedBook} />
              <button
                className="absolute right-0 top-0 text-lg"
                onClick={() => setSelectedBook(null)}
              >
                X
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={onSearchBookHandler} action="#" method="POST">
                <Input
                  className="mb-6"
                  left={<SearchActiveIcon />}
                  name="book"
                  placeholder="책 제목을 알려주세요."
                  button={<Button className="w-16 p-2 m-0">검색</Button>}
                />
              </form>
              <SearchBookList
                ref={containerRef}
                bookList={data?.items}
                selectedBook={selectedBook}
                onSelectedBook={onSelectedBook}
                onPagination={onPagination}
              />
            </>
          )}
          {isSuccess && data?.items.length == 0 && (
            <div>결과가 없습니다! 다시 검색 해주세요.</div>
          )}
          <NewBookPostForm
            className="max-w-5xl mt-4"
            onSubmit={handleSubmit}
            setImageHandler={setImageHandler}
            isLoading={isImageLoading}
          />
        </div>
      </div>
    </>
  );
}
