import { useSyncMutation } from "@/hooks/query";
import { apiClient } from "@/utils/api/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import router from "next/router";
import { useCallback } from "react";

export const POST_DETAIL_QUERY_KEY = "getPostDetail";
export const POST_QUERY_KEY = "getPost";

// const defaultMutationOptions = {
//   onError: (err, variables, recover) =>
//     typeof recover === "function" ? recover() : null,
//   onSettled: () = queryClient.invalidateQueries("list-items")
// };

interface Props {
  options?: any;
  queryKey: any[];
}

interface QueryProps {
  options?: any;
  query: string;
}

function useSearchPost({ query, options }: QueryProps) {
  return useQuery(getSearchPostConfig(query, options));
}

const getSearchPostConfig = (query: string, options = {}) => ({
  queryKey: [POST_QUERY_KEY, query],
  queryFn: () =>
    apiClient.get(`api/posts?search=${query}`).then(({ data }) => data),
  config: {
    onSucess: (posts: any) => {
      // 개별 아이템 캐시 해야함
      // for (const post of posts) {
      //   queryCache.setQueryData(
      //     [POST_DETAIL_QUERY_KEY, {id: post.id}],
      //     post,
      //   )
      // }
    },
    ...options,
  },
});

function useUpdateLike({ options = {}, queryKey }: Props) {
  const queryClient = useQueryClient();

  return useSyncMutation(
    (id: number) => apiClient.post(`api/posts/${id}/like`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error: any) => {
        console.error(error);
      },
      ...options,
    }
  );
}

function useDeleteLike({ options = {}, queryKey }: Props) {
  const queryClient = useQueryClient();
  return useSyncMutation(
    (id: number) => apiClient.delete(`api/posts/${id}/like`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error: any) => {
        console.error(error);
      },
      ...options,
    }
  );
}

function usePostComment({ options = {}, queryKey }: Props) {
  const queryClient = useQueryClient();
  return useMutation(
    ({ data, id }: { data: any; id: number }) =>
      apiClient.post(`api/posts/${id}/comment`, { data }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(queryKey);
      },
      onError: async (error: any) => {
        console.error(error);
      },
      ...options,
    }
  );
}

function usePost({ options = {}, queryKey }: Props) {
  const queryClient = useQueryClient();
  return useMutation((data) => apiClient.post(`/api/posts`, data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(queryKey);
      router.replace("/");
    },
    onError: async (error: any) => {
      console.error(error);
    },
    ...options,
  });
}

function useDeletePost({ options = {}, queryKey }: Props) {
  const queryClient = useQueryClient();
  return useMutation((id: number) => apiClient.delete(`api/posts/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error: any) => {
      console.error(error);
    },
    ...options,
  });
}

function useDeleteComment({ options = {}, queryKey }: Props) {
  const queryClient = useQueryClient();
  return useMutation(
    (id: number) => apiClient.delete(`api/posts/${id}/comment`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error: any) => {
        console.error(error);
      },
      ...options,
    }
  );
}

function useEditPost({ options = {}, queryKey }: Props) {
  const queryClient = useQueryClient();
  return useMutation(
    ({ data, id }: { data: any; id: number }) => {
      return apiClient.patch(`api/posts/${id}`, { data });
    },

    {
      onSuccess: (id: number) => {
        queryClient.invalidateQueries(queryKey);
        router.replace("/");
      },
      onError: (error: any) => {
        console.error(error);
      },
      ...options,
    }
  );
}

function useRefetchPostSearchQuery() {
  const queryClient = useQueryClient();
  return useCallback(
    async function refetchPostSearchQuery() {
      queryClient.removeQueries([POST_QUERY_KEY]);
      await queryClient.prefetchQuery(getSearchPostConfig(""));
    },
    [queryClient]
  );
}

export {
  useSearchPost,
  useUpdateLike,
  useDeleteLike,
  usePostComment,
  usePost,
  useDeletePost,
  useDeleteComment,
  useEditPost,
  useRefetchPostSearchQuery,
};
