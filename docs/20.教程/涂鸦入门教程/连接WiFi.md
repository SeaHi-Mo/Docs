---
date: 2026-01-31 09:24:24
title: 连接WiFi
permalink: /tutorial/tuya/wifi
categories:
  - 涂鸦入门教程
author:
  name: SeaHi
  link: https://docs.c-hi.cn
coverImg: /img/tuya/T2Board.png
articleUpdate: false
inHomePost: false
---

## 概述

为什么不继续写其他外设的编程？<br>
原因有三：<br>
1. 涂鸦的模组需要连接到涂鸦开放平台才是精髓
2. 其他外设会在做应用项目时再编写教程
3. T2-U 开发板是一款WiFi+BLE 的模组，无线功能才是重点

接下来的正式进入 T2-U 开发板的无线功能编程部分，从本章开始，我们才算真正入门涂鸦开放平台。

## 实现思路
- 本章不会新建工程了，沿用之前的工程，在 `blink_led` 工程的基础上进行修改
- 本章我们会全程参考 tuya 开发者平台的文档，实现开发板连接到WiFi网络，关于 WiFi 编程指南的快捷方式如下：

::: navCard
```yaml

- name: TuyaOS-WiFi
  desc: 涂鸦通用SDK
  link: https://developer.tuya.com/cn/docs/iot-device-dev/TuyaOS-iot_abi_driver_wifi?id=Kcusut0tv85ee
  img:  /svg/tuya.svg
  badge: 官方文档
  badgeType: tip
```
:::

<center>

```mermaid
flowchart TB
    A["开始"] -- <br> --> B("初始化WiFi")
    B --> n11["设置成STA模式"]
    n11 --> n1["配置 WiFi 事件回调"]
    n1 --> n2["WiFi 是否已经就绪"]
    n2 -- 是 --> n3["连接WiFi"]
    n3 --> n4(["结束"])
    n2 -- 否 --> n4

    n2@{ shape: diam}
    click n11 "#设置成sta模式"
    click B "#初始化wi-fi"
    click n1 "#配置wifi事件回调"
    click n3 "#连接wi-fi"
```
</center>



## 初始化Wi-Fi

1. 打开 `blink_led/src/tuya_device.c` 文件
2. 引用 Wi-Fi 相关的头文件：`tuya_iot_wifi_api.h`
3. 创建一个回调函数 `user_wifi_event_cb`，用于处理 WiFi 事件
4. 在 `user_main` 函数中初始化 WiFi 模块：`tkl_wifi_init(user_wifi_event_cb)`
- 代码如下（编译没报错就可下一步）：

```c
#include "tuya_iot_config.h"
#include "tuya_cloud_types.h"
#include "tuya_cloud_com_defs.h"
#include "tal_thread.h"
#include "tal_log.h"
#include "tal_system.h"
#include "tkl_gpio.h"
#include "tuya_iot_wifi_api.h" //[!code focus][!code ++] wifi相关接口

STATIC VOID_T user_wifi_event_cb(WF_EVENT_E event, VOID_T *arg)//[!code focus][!code ++]
{//[!code focus][!code ++]
//[!code ++]
}//[!code focus][!code ++]

STATIC VOID user_main(VOID_T)//[!code focus]
{//[!code focus]
    tuya_base_utilities_init();                   //初始化基础组件
    tal_log_set_manage_attr(TAL_LOG_LEVEL_DEBUG); //设置日志级别
    // 配置LED引脚
    TUYA_GPIO_BASE_CFG_T led_cfg = {0};
    led_cfg.mode = TUYA_GPIO_PUSH_PULL;  // 推挽输出
    led_cfg.level = TUYA_GPIO_LEVEL_LOW; // 默认低电平
    led_cfg.direct = TUYA_GPIO_OUTPUT;   // 输出方向
    tkl_gpio_init(TUYA_GPIO_NUM_26, &led_cfg); // 初始化GPIO26
    tkl_wifi_init(user_wifi_event_cb); //[!code focus][!code ++] 初始化wifi
    while (1)
    {
        tkl_gpio_write(TUYA_GPIO_NUM_26, TUYA_GPIO_LEVEL_HIGH);
        tal_system_sleep(500);
        tkl_gpio_write(TUYA_GPIO_NUM_26, TUYA_GPIO_LEVEL_LOW);
        tal_system_sleep(500);
    }

    return;
}//[!code focus]
```
## 设置成STA模式

Wi-Fi 设备有AP和STA模式之分，AP 模式是指设备作为一个热点，其他设备可以连接到该热点；STA 模式是指设备作为一个客户端，连接到已有的热点。<br>
我们需要把 T2-U 开发板设置成 STA 模式，才能连接到自己的路由器。<br>
- 代码如下（编译没报错就可下一步）：
```c
tkl_wifi_set_work_mode(WWM_STATION);
```

## 配置WiFi事件回调

TuyaOS 的文档当中，并没有详细介绍 `WF_EVENT_E` 事件，我们需要自己去查看 `tuya_iot_wifi_api.h` 文件，介绍如下：
::: note WF_EVENT_E
- WFE_CONNECTED: 连接成功
- WFE_CONNECT_FAILED: 连接失败
- WFE_DISCONNECTED: 断开连接
:::

所以，我们需要在 `user_wifi_event_cb` 函数中处理这三个事件，代码如下：

```c
STATIC VOID_T user_wifi_event_cb(WF_EVENT_E event, VOID_T *arg)
{
    switch (event)//[!code focus][!code ++]
    {//[!code focus][!code ++]
    case WFE_CONNECTED://[!code focus][!code ++]
        TAL_PR_INFO("wifi connected");//[!code focus][!code ++]
        break;//[!code focus][!code ++]
    case WFE_CONNECT_FAILED://[!code focus][!code ++]
        TAL_PR_INFO("wifi connect failed");//[!code focus][!code ++]
        break;//[!code focus][!code ++]
    case WFE_DISCONNECTED://[!code focus][!code ++]
        TAL_PR_INFO("wifi disconnected");//[!code focus][!code ++]
        break;//[!code focus][!code ++]
    default://[!code focus][!code ++]
        break;//[!code focus][!code ++]
    }//[!code focus][!code ++]
}
```

## 连接Wi-Fi

1. 创建两个宏定义，分别代表 Wi-Fi 名称和密码
2. 调用 `tkl_wifi_station_connect` 函数连接到指定的 Wi-Fi 网络

- 代码如下：
```c


```

## 烧录验证


