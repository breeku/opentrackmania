import React from 'react'

export const groupBy = (items, key) =>
    items.reduce(
        (result, item) => ({
            ...result,
            [item[key]]: [...(result[item[key]] || []), item],
        }),
        {},
    )

export const textParser = title => {
    const arr = title.split('')
    let str = '<span>'
    let color = ''

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '$') {
            if (arr[i + 1] === 'w') {
                str += '</span>'
                str += `<span style='font-stretch: expanded'>`
                i += 1
            } else if (arr[i + 1] === 'n') {
                str += '</span>'
                str += `<span style='font-stretch: condensed'>`
                i += 1
            } else if (arr[i + 1] === 'o') {
                str += '</span>'
                str += `<span style='font-weight: bold'>`
                i += 1
            } else if (arr[i + 1] === 'i') {
                str += '</span>'
                str += `<span style='font-style: italic'>`
                i += 1
            } else if (arr[i + 1] === 't') {
                str += '</span>'
                str += `<span style='text-transform: uppercase'>`
                i += 1
            } else if (arr[i + 1] === 's') {
                str += '</span>'
                str += `<span style='text-shadow: 2px 2px #000'>`
                i += 1
            } else if (arr[i + 1] === 'g') {
                str += '</span>'
                str += `<span style='color: #fff'>`
                i += 1
            } else if (arr[i + 1] === 'z') {
                str += '</span>'
                str += `<span style='font-style: default'>`
                i += 1
            } else if (arr[i + 1] === '$') {
                str += '</span>'
                str += `<span>$`
                i += 1
            } else {
                str += '</span>'
                color = arr[i + 1] + arr[i + 2] + arr[i + 3]
                str += `<span style='color: #${color}'>`
                i += 3
            }
        } else if (arr[i] !== '') str += arr[i]
    }
    str += '</span>'
    return <span dangerouslySetInnerHTML={{ __html: str }} />
}
