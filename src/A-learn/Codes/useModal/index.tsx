/**
 * @description Promise 弹窗 hooks
 */

import React, { useRef, useState } from 'react'
import { Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal/modal'

export type UseModalType = <T>(
  Component: React.ForwardRefExoticComponent<React.RefAttributes<T>>,
  modalProps?: ModalProps,
) => {
  open: (props?: any) => void
  close: () => void
  setComponentProps: React.Dispatch<React.SetStateAction<{}>>
  component: any
}

export const useModal: UseModalType = (Component, modalProps) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [componentProps, setComponentProps] = useState({})
  const componentRef = useRef<any>()
  const resolveRef = useRef<(value: unknown) => void>()
  const rejectRef = useRef<(reason?: any) => void>()

  const open = async (componentProps?: any) => {
    componentProps && setComponentProps(componentProps)
    setVisible(true)

    return new Promise((resolve, reject) => {
      resolveRef.current = resolve
      rejectRef.current = reject
    })
  }

  const close = () => {
    setVisible(false)
  }

  const onOk = async () => {
    try {
      const data = await componentRef?.current?.onResolve?.()
      modalProps?.onOk?.(data)
      resolveRef.current?.(data)
      close()
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = async () => {
    try {
      const data = await componentRef?.current?.onReject?.()
      modalProps?.onCancel?.(data)
      rejectRef.current?.(data)
      close()
    } catch (error) {
      console.log(error)
    }
  }

  return {
    open,
    close,
    setComponentProps,
    component: (
      <Modal visible={visible} destroyOnClose maskClosable={false} {...modalProps} onCancel={onCancel} onOk={onOk}>
        <Component ref={componentRef} {...componentProps} />
      </Modal>
    ),
  }
}

export default useModal
