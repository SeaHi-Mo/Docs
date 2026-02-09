---
date: 2026-01-31 09:24:33
title: 连接 Tuya 开发者平台
permalink: /tutorial/tuya/connect
categories:
  - 连接 Tuya 平台
author:
  name: SeaHi
  link: https://docs.c-hi.cn
coverImg: /img/tuya/T2Board.png
articleUpdate: false
inHomePost: false
---

## 概述

TuyaOS 连接Tuya 开发者平台，需要平台创建一个产品，获取到产品的 `ProductID` 和 `ProductSecret`，并在 TuyaOS 中配置这两个参数，才能实现连接。<br>
值得注意的是，TuyaOS 连接 Tuya 开发者平台需用通过 TuyaOS 的配网功能，将 TuyaOS 设备连接到 Tuya 开发者平台的 Wi-Fi 网络。<br>
对比其他的例程，本章会多出两个步骤，分别是：
- 步骤1：在 Tuya 开发者平台创建一个产品，获取到产品的 `ProductID` 和 `ProductSecret`。
- 步骤2：在 TuyaOS 使用配网功能，将 TuyaOS 设备连接到 Tuya 开发者平台的 Wi-Fi 网络。

因为连接 Tuya 平台涉及的篇幅比较长，为了方便大家查阅，我会分篇幅介绍整个实现过程：

::: navCard
```yaml
config:
    target: _self
data:

  - name: 1.创建产品
    desc: 在 Tuya 开放平台上创建产品 
    link: /tutorial/tuya/create-product
    img:  /svg/tuya.svg
    badge: 第一步

  - name: 2.配网功能
    desc: TuyaOS 的配网功能介绍及实现方法
    link: /tutorial/tuya/netconfig
    img:  /svg/tuya.svg
    badge: 第二步
  
```
:::