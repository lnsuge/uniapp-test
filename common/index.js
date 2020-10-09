// 优化 uni 的 promise 方法
export const uniPromiseify = (fn) => {
  return async (...args) => {
    const [error, res] = await fn(...args)
    if (error) throw error
    return res
  }
}

// 优化 wx 的方法
export const wxPromiseify = (fn, context) => {
  // eslint-disable-next-line require-await
  return async (args) => {
    return new Promise((resolve, reject) => {
      fn.call(context, {
        success: resolve,
        fail: reject,
        ...args,
      })
    })
  }
}

// 包装 loading 流程
export const wrapperLoading = async (title, block, failure, complate) => {
  try {
    title && uni.showLoading({ title })
    await block()
  } catch (error) {
    if (typeof failure === 'function') {
      failure(error)
    } else {
      throw error
    }
  } finally {
    title && uni.hideLoading()
    if (typeof complate === 'function') {
      complate()
    }
  }
}
