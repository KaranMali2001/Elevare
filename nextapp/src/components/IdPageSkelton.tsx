import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

function IdPageSkelton() {
  return (
    <div className="flex flex-col w-full h-[91vh] p-4 mx-auto">
      <div>
        <SkeletonTheme
          borderRadius={"50"}
          baseColor="#ddd"
          highlightColor="#bbb"
        >
          <div className="bg-white flex justify-between px-4 py-2 rounded-md">
            <p>
              <Skeleton count={1} width={"20%"} />
            </p>
            <p>
              <Skeleton count={1} width={"20%"} />
            </p>
            <p>
              <Skeleton count={2} width={"20%"} />
            </p>
          </div>
        </SkeletonTheme>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <SkeletonTheme
            borderRadius={"50"}
            baseColor="#ddd"
            highlightColor="#bbb"
          >
            <div className="bg-white grid grid-cols-2 px-4 py-2 rounded-md">
              <p>
                <Skeleton count={1} width={"60%"} />
              </p>
              <p>
                <Skeleton count={1} width={"30%"} />
              </p>
              <p>
                <Skeleton count={2} width={"100%"} />
              </p>
            </div>
          </SkeletonTheme>
          <SkeletonTheme
            borderRadius={"50"}
            baseColor="#ddd"
            highlightColor="#bbb"
          >
            <div className="bg-white grid grid-cols-2 px-4 py-2 rounded-md">
              <p>
                <Skeleton count={1} width={"60%"} />
              </p>
              <p>
                <Skeleton count={1} width={"30%"} />
              </p>
              <p>
                <Skeleton count={2} width={"100%"} />
              </p>
            </div>
          </SkeletonTheme>
        </div>
        <div>
          <SkeletonTheme
            borderRadius={"50"}
            baseColor="#ddd"
            highlightColor="#bbb"
          >
            <div className="bg-white grid grid-cols-2 px-4 py-2 rounded-md">
              <p>
                <Skeleton count={1} width={"100%"} />
              </p>
              <p>
                <Skeleton count={1} width={"100%"} />
              </p>
              <p>
                <Skeleton count={4} width={"100%"} />
              </p>
              <p>
                <Skeleton count={1} width={"100%"} />
              </p>
              <p>
                <Skeleton count={1} width={"100%"} />
              </p>
              <p>
                <Skeleton count={1} width={"100%"} />
              </p>
              <div className="flex justify-between">
                <p>
                  <Skeleton count={1} width={"20%"} />
                </p>
                <p>
                  <Skeleton count={1} width={"20%"} />
                </p>
              </div>
            </div>
          </SkeletonTheme>
        </div>
      </div>
    </div>
  );
}

export default IdPageSkelton;
