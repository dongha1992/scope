import { getServerSession } from "next-auth";
import { prisma } from "../../../../server/db/client";
import { options } from "../../api/auth/[...nextauth]";

export interface Session {
  user: {
    name: string;
    email: string;
    image: string;
  };
  expires: Date;
  loggedUser?: string;
}

async function getMe(req: any, res: any) {
  const session: Session | null = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: "인증 되지 않은 회원입니다." });
    return;
  }

  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!prismaUser) {
    res.status(401).json({ error: "인증 되지 않은 회원입니다." });
    return;
  }

  res.status(200).json(prismaUser);
}
async function updateMe(req: any, res: any) {
  const session: Session | null = await getServerSession(req, res, options);
  const { data } = req.body;

  if (!session) {
    res.status(401).json({ error: "인증 되지 않은 회원입니다." });
    return;
  }

  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!prismaUser) {
    res.status(401).json({ error: "인증 되지 않은 회원입니다." });
    return;
  }

  await prisma.user.update({
    where: { email: prismaUser.email },
    data: { name: data.name, image: data.profileImage },
  });

  res.status(200).json({ name: data.name, image: data.profileImage });
}

export default async function handler(req: any, res: any) {
  const { method } = req;
  switch (method) {
    case "GET":
      getMe(req, res);
      break;
    case "PATCH":
      updateMe(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      res.status(405).end("잘못된 호출입니다.");
  }
}
