import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { Writable } from "stream";

export const runtime = "nodejs";
export const config = { api: { bodyParser: false } };

// async function getBusboy(headers: Record<string, string>) {
//   // console.log("动态导入 busboy");
//   const BusboyModule = await import("busboy");
//   // console.log("BusboyModule:", BusboyModule);
//   const Busboy = BusboyModule.Busboy || BusboyModule.default || BusboyModule;

//   // console.log("busboy 导入成功，构造函数：", Busboy);

//   return Busboy({ headers });
// }
async function getBusboy(headers: Record<string, string>) {
  const { default: createBusboy } = await import("busboy");
  return createBusboy({ headers });
}

function saveFile(filename: string, stream: NodeJS.ReadableStream): Promise<string> {
  const uploadDir = path.join(process.cwd(), "uploads");
  // console.log("检查上传目录：", uploadDir);
  if (!fs.existsSync(uploadDir)) {
    // console.log("目录不存在，创建中...");
    fs.mkdirSync(uploadDir);
  }
  const filepath = path.join(uploadDir, filename);
  // console.log("保存文件到：", filepath);
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filepath);
    stream.pipe(writeStream);
    writeStream.on("finish", () => {
      // console.log("文件保存完成：", filename);
      resolve(filename);
    });
    writeStream.on("error", (err) => {
      console.error("文件写入错误：", err);
      reject(err);
    });
  });
}

export async function POST(req: Request) {
  // console.log("收到上传请求");
  try {
    const contentType = req.headers.get("content-type") || "";
    // console.log("Content-Type:", contentType);
    if (!contentType.includes("multipart/form-data")) {
      console.error("错误的 Content-Type");
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const headers = Object.fromEntries(req.headers.entries());
    // console.log("请求头：", headers);

    const busboy = await getBusboy(headers);

    const promises: Promise<string>[] = [];

    busboy.on("file", (_fieldname, fileStream, info) => {
      // 关键：中文文件名乱码处理
      const rawFilename = info.filename;
      const filename = Buffer.from(rawFilename, "latin1").toString("utf8");

      // console.log("开始处理文件，原始名:", rawFilename, "转换后:", filename);

      // 过滤非法字符
      const safeFilename = filename.replace(/[/\\?%*:|"<>]/g, "_");

      promises.push(saveFile(safeFilename, fileStream));
    });

    return new Promise<Response>((resolve, reject) => {
      busboy.on("finish", async () => {
        // console.log("busboy 处理结束");
        try {
          const savedFiles = await Promise.all(promises);
          // console.log("所有文件保存成功：", savedFiles);
          resolve(
            NextResponse.json({
              message: "Upload successful",
              files: savedFiles,
            })
          );
        } catch (e) {
          console.error("保存文件时出错：", e);
          reject(
            NextResponse.json(
              { error: "Saving files failed", detail: e instanceof Error ? e.message : e },
              { status: 500 }
            )
          );
        }
      });

      busboy.on("error", (err: unknown) => {
        console.error("busboy 错误：", err);
        let message = "Unknown error";
        if (err instanceof Error) {
          message = err.message;
        }
        reject(
          NextResponse.json({ error: "Busboy error", detail: message }, { status: 500 })
        );
      });

      const reader = req.body?.getReader();
      if (!reader) {
        console.error("请求体为空");
        return resolve(NextResponse.json({ error: "No body" }, { status: 400 }));
      }

      const writable = new Writable({
        write(chunk, _encoding, callback) {
          busboy.write(chunk);
          callback();
        },
        final(callback) {
          busboy.end();
          callback();
        },
      });

      (async function pump() {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            writable.write(value);
          }
          writable.end();
        } catch (e) {
          console.error("读取请求流错误：", e);
          reject(
            NextResponse.json(
              { error: "Stream error", detail: e instanceof Error ? e.message : e },
              { status: 500 }
            )
          );
        }
      })();
    });
  } catch (err) {
    console.error("POST 处理异常：", err);
    return NextResponse.json({ error: "Internal Server Error", detail: err instanceof Error ? err.message : err }, { status: 500 });
  }
}
