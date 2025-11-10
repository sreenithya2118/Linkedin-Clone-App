const toStringId = (value: unknown): string => {
  if (value === undefined || value === null) return "";
  return String(value);
};

export const normalizeUser = (rawUser: any) => ({
  id: toStringId(rawUser?.id ?? rawUser?._id),
  name: rawUser?.name ?? rawUser?.username ?? "",
  email: rawUser?.email ?? "",
  headline: rawUser?.headline ?? rawUser?.userHeadline ?? null,
  avatar: rawUser?.avatar ?? rawUser?.userAvatar ?? null,
  bio: rawUser?.bio ?? null,
  location: rawUser?.location ?? null,
  company: rawUser?.company ?? null,
  position: rawUser?.position ?? null,
  createdAt: rawUser?.createdAt ?? rawUser?.updatedAt ?? null
});

export const normalizePost = (rawPost: any) => {
  const normalizedUser = normalizeUser(
    rawPost?.user ?? {
      id: rawPost?.userId,
      name: rawPost?.username,
      headline: rawPost?.userHeadline,
      avatar: rawPost?.userAvatar
    }
  );

  return {
    id: toStringId(rawPost?.id ?? rawPost?._id),
    userId: toStringId(rawPost?.userId ?? rawPost?.user?._id ?? rawPost?.user?.id),
    content: rawPost?.content ?? "",
    imageUrl: rawPost?.imageUrl ?? rawPost?.imageURL ?? null,
    likesCount:
      rawPost?.likesCount ??
      (Array.isArray(rawPost?.likes) ? rawPost.likes.length : 0),
    commentsCount:
      rawPost?.commentsCount ??
      (Array.isArray(rawPost?.comments) ? rawPost.comments.length : 0),
    createdAt: rawPost?.createdAt ?? new Date().toISOString(),
    isLiked: Boolean(rawPost?.isLiked),
    user: normalizedUser
  };
};

export const normalizeComment = (rawComment: any, postId?: string) => {
  const normalizedUser = normalizeUser(
    rawComment?.user ?? {
      id: rawComment?.userId,
      name: rawComment?.username,
      headline: rawComment?.headline,
      avatar: rawComment?.avatar
    }
  );

  return {
    id: toStringId(rawComment?.id ?? rawComment?._id),
    userId: normalizedUser.id,
    postId: toStringId(postId ?? rawComment?.postId ?? rawComment?.post?._id),
    content: rawComment?.content ?? rawComment?.text ?? "",
    createdAt: rawComment?.createdAt ?? new Date().toISOString(),
    user: normalizedUser
  };
};

