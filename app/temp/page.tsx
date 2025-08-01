import ReactMarkdown from "react-markdown";
import "./prettier-scroll.css";

export default function Page() {
  return (
    <div className="w-screen h-[100dvh] flex flex-col overflow-hidden whole">
      {/* 视频区域，占上半屏 */}
      <div className="flex h-[50dvh] w-full">
        <p className="flex w-[40dvw] items-center justify-center text-center p-4">
          右侧是自制的一个模型显示器<br/>（非下方贴出代码）
        </p>

        <div className="flex max-w-xl w-[60dvw] ml-auto p-2">
          <video
            controls
            className="w-full h-full rounded-2xl shadow-lg bg-black"
          >
            <source src="/videos/opengl.mp4" type="video/mp4" />
            您的浏览器不支持 video 标签。
          </video>
        </div>
      </div>


      {/* Markdown 区域，占下半屏 */}
      <div className="flex-1 w-full mx-auto p-4 overflow-y-auto whitespace-pre-wrap break-words prettier-scroll">
        <ReactMarkdown>
{`~~~cpp
#include<cstdio>
#define UNIMAIN_TEST
#include<macro_setting/unimain.hpp>
#define GLAD_GLAPI_EXPORT
#include<glad/glad.h>
#include<GLFW/glfw3.h>
#define LCCTOOLBOX_DLL_IMPORT_LCCTOOLBOX
#include<lcctoolbox_filebox.hpp>
#ifdef _WIN32
#pragma comment(lib,"glad")
#pragma comment(lib,"glfw3dll")
#pragma comment(lib,"lcctoolbox")
#endif

int unimain(int argc,char** argv){
  unipiece(argc,argv)
  LccToolbox::Bstr programPath;
  programPath.insert(0,argv[0],strlen(argv[0])-strlen("oopengl")+1);// +1 is for '\\0'
  programPath[programPath.size()-1]='\\0';
  LccToolbox::originstr middlePath;
  // < Init glfw >
  if(!glfwInit()){ printf("glfwInit fail\\n");return 1; }
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR,4);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR,5);
  glfwWindowHint(GLFW_OPENGL_PROFILE,GLFW_OPENGL_CORE_PROFILE);
  // glfwWindowHint(GLFW_SAMPLES,32);
  glfwWindowHint(GLFW_VISIBLE,GLFW_FALSE);

  // < create the window|context >
  GLFWwindow* win1=glfwCreateWindow(700,700,"oOpenGL",nullptr,nullptr);
  // [ bind the context ]
  glfwMakeContextCurrent(win1);
  glfwSwapInterval(1);
  gladLoadGL();

  // < GL obj >
  // * prepare
  // [ prepare data ]
  float l=0.5f;
  float cubePoints[]={-l,l,l,l,l,l,-l,l,-l,l,l,-l,-l,-l,l,l,-l,l,-l,-l,-l,l,-l,-l};
  unsigned int indexes[]={0,1,5,0,1,3,1,3,5,3,5,7,3,7,6,6,7,5,0,2,3,2,3,6,0,2,6,0,4,5,0,4,6,4,6,5};
  LccToolbox::fileBox vtxCode{middlePath.combineStr(programPath.ptr(),"../carry/vtx.glsl").c_str()};
  LccToolbox::fileBox frgCode{middlePath.combineStr(programPath.ptr(),"../carry/frg.glsl").c_str()};
  // [ prepare GLobjs ]
  GLuint arrayBuffer,indexBuffer;
  glGenBuffers(1,&arrayBuffer);
  glGenBuffers(1,&indexBuffer);
  GLuint array;
  glGenVertexArrays(1,&array);
  GLuint vtxShader=glCreateShader(GL_VERTEX_SHADER);
  GLuint frgShader=glCreateShader(GL_FRAGMENT_SHADER);
  GLuint shaderProgram=glCreateProgram();
  GLuint dynamicShaderProgram=glCreateProgram();
  // * set|load
  // [ shader GLobj ]
  const char*vtxSource=vtxCode.content();
  const char*frgSource=frgCode.content();
  if(vtxSource)
  { glShaderSource(vtxShader,1,&vtxSource,NULL);
    glCompileShader(vtxShader);
    glAttachShader(shaderProgram,vtxShader);
    glDeleteShader(vtxShader);
  }
  if(frgSource)
  { glShaderSource(frgShader,1,&frgSource,NULL);
    glCompileShader(frgShader);
    glAttachShader(shaderProgram,frgShader);
    glDeleteShader(frgShader);
  }
  glLinkProgram(shaderProgram);
  GLint programStatu=GL_FALSE;
  glGetProgramiv(shaderProgram,GL_LINK_STATUS,&programStatu);
  if(programStatu==GL_FALSE){ printf("fail to link shaderProgram\\n");return 2; }
  glUseProgram(shaderProgram);
  // [ data GLobj ]
  glNamedBufferData(arrayBuffer,sizeof(cubePoints),cubePoints,GL_STATIC_DRAW);
  glNamedBufferData(indexBuffer,sizeof(indexes),indexes,GL_STATIC_DRAW);
  glBindVertexArray(array);
  glEnableVertexAttribArray(0);
  glBindBuffer(GL_ARRAY_BUFFER,arrayBuffer);
  glVertexAttribPointer(0,3,GL_FLOAT,GL_FALSE,12,nullptr);
  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER,indexBuffer);

  // < extension part for testing >
  bool direction=true;
  auto subDataTest=[&]
  { if(cubePoints[1]<0.2f) direction=false;
    if(cubePoints[1]>0.8f) direction=true;
    for(int i=0;i<8*3;++i) cubePoints[i]*=direction?0.99f:1.01f;
    glNamedBufferSubData(arrayBuffer,0,sizeof(cubePoints),cubePoints);
  };
  auto freshShaderProgram=[&]
  { vtxCode.read("demo/oOpenGL/carry/vtx.glsl");
    frgCode.read("demo/oOpenGL/carry/frg.glsl");
    vtxSource=vtxCode.content();
    frgSource=frgCode.content();
    if(vtxSource)
    { glShaderSource(vtxShader,1,&vtxSource,NULL);
      glCompileShader(vtxShader);
      glAttachShader(dynamicShaderProgram,vtxShader);
      glDeleteShader(vtxShader);
    }
    if(frgSource)
    { glShaderSource(frgShader,1,&frgSource,NULL);
      glCompileShader(frgShader);
      glAttachShader(dynamicShaderProgram,frgShader);
      glDeleteShader(frgShader);
    }
    glLinkProgram(dynamicShaderProgram);
    programStatu=GL_FALSE;
    glGetProgramiv(dynamicShaderProgram,GL_LINK_STATUS,&programStatu);
    if(programStatu==GL_FALSE){ printf("fail to link dynamicShaderProgram\\n");glUseProgram(shaderProgram);return; }
    glUseProgram(dynamicShaderProgram);
  };
  auto Tests=[&]{subDataTest();freshShaderProgram();};

  // < run the window >
  glfwShowWindow(win1);
  while(!glfwWindowShouldClose(win1))
  { glfwPollEvents();Tests();
    glClear(GL_COLOR_BUFFER_BIT);
    glDrawElements(GL_TRIANGLES,36,GL_UNSIGNED_INT,nullptr);
    glfwSwapBuffers(win1);
  }

  return 0;
}
~~~`}
      </ReactMarkdown>
    </div>
  </div>);
}
