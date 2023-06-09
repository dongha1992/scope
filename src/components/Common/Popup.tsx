import { popupState } from "@/store/common";
import { getZIndex } from "@/utils/getZIndex";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useRecoilState } from "recoil";

function Popup({ isOpen, text, onClickConfirm, hasCustomButton }: any) {
  const [popup, setPopup] = useRecoilState(popupState);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          onClose={() => setPopup({ isOpen: false })}
          style={{ zIndex: getZIndex("popup") }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {text}
                  </Dialog.Title>
                  {!hasCustomButton && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border px-4 py-2 text-sm font-medium text-indigo-500 focus:outline-none focus-visible:ring-offset-2 mr-2"
                        onClick={() => {
                          onClickConfirm && onClickConfirm();
                          setPopup({ isOpen: false });
                        }}
                      >
                        확인
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border px-4 py-2 text-sm font-medium text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        onClick={() => setPopup({ isOpen: false })}
                      >
                        취소
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Popup;
