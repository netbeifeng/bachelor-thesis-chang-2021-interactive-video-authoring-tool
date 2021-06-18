# ILV - Interactive Learning Video Authoring Tool 
This project is developed based on my thesis which introduces the use of markup language to edit interactive learning videos instead of the traditional WYSIWYG editing.

## TL;DR

### Install 
```bash
npm install @netbeifeng/ilv-interactive-video-authoring-tool -g
```
Please execute the `cilv version` command to test whether the tool is correctly installed, and this command will help you to install the necessary dependency `concurrently` globally.

### Template
You can execute the command `cilv init <project_name>` to initialize an ILV document by using the template.

### Deploy and Debugging
The command `cilv deploy <project_name>` is employed to parse the given ilv document and deploy it to the localhost webserver.
The webserver is hosted by React. Concurrently, a listener will be added to the given ilv file, if something triggers a content change,
the parsing will restart and project will be re-deployed to the webserver, so that the author can see the changes immediately.

## Structure
[cli](https://github.com/netbeifeng/bachelor-thesis-chang-2021-interactive-video-authoring-tool/tree/main/cli) -> Source code of CILV cli tool
[highlighter](https://github.com/netbeifeng/bachelor-thesis-chang-2021-interactive-video-authoring-tool/tree/main/highlighter/ilv) -> Source code of vscode highlighter
[parser](https://github.com/netbeifeng/bachelor-thesis-chang-2021-interactive-video-authoring-tool/tree/main/parser) -> Source code of ilv parser
[validator](https://github.com/netbeifeng/bachelor-thesis-chang-2021-interactive-video-authoring-tool/tree/main/validator) -> Source code of json validator
[components](https://github.com/netbeifeng/bachelor-thesis-chang-2021-interactive-video-authoring-tool/tree/main/src/components) -> React components 
[utilities](https://github.com/netbeifeng/bachelor-thesis-chang-2021-interactive-video-authoring-tool/tree/main/src/utilities) -> ILV Object TypeScript defintion
[testing](https://github.com/netbeifeng/bachelor-thesis-chang-2021-interactive-video-authoring-tool/tree/main/testing) -> Testing.ilv document

## ILV Markup Language
Here is an examplar of ILV document.

A valid document should enclosed with a pair of braces, which called `RootProperty`.

The following key must be defined within the `RootProperty`. 
|   |title|course|chapter|author|semester|audio|subtitle*|font*|
|---|---|---|---|---|---|---|---|---|---|
|type|String|String|String|String|String|String|String|Array|

```
{
    /* This ILV document is created by cilv tool */
    $title = "ILV Component Testing"
    $course = "Bachelor Arbeit"
    $chapter = "Inspection - Functional Examination"
    $author = "Chang Luo"
    $semester = "SoSe21"
    $audio = "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav"   /* OR Local Audio File */
    $subtitle = "./sub.vtt"

    $font = [
        "./ShetockFont.ttf",                                                 /* Local Fonts */
        "https://fonts.googleapis.com/css2?family=Staatliches&display=swap", /* Gooogle Fonts */
        "https://open-foundry.com/data/fonts/LeagueGothic-Italic.otf"        /* Web Fonts */
    ]

    ^slide = {
        $page = 1                           /* the page of this slide */
        $name = "Text Component Testing"    /* the title of this slide */
        $last = (0-10)

        /* Here for adding Block Properties */

        ^text = {
            $id = 101
            $content = "Text Component Test =>
            - Markdown Test -> [Link](https://hs-hannover.de) **Bold** *Italic*
            - Color Test -> {red}(Red Color) {#DC3C0B}(Color #DC3C0B)
            - Math Inline Test -> $\\lim\\limits_{x \\to \\infty} \\exp(-x) = 0$
            - Code Inline Test -> `console.log('Hello World')`{.js}"
            $position = (150, 180)
        }

        ^text = {
            $id = 102
            $content = "
            - Code Block Test ->
                ```java
                System.out.println(\"Here is a code block test\");
                ```
            - Math Block Test ->
                $$A_{m,n} =
                \\begin{pmatrix}
                a_{1,1} & a_{1,2} & \\cdots & a_{1,n} \\\\
                a_{2,1} & a_{2,2} & \\cdots & a_{2,n} \\\\
                \\vdots  & \\vdots  & \\ddots & \\vdots \\\\
                a_{m,1} & a_{m,2} & \\cdots & a_{m,n}
                \\end{pmatrix}
                $$"
            $position = (950, 180)
        }

        ^text = {
            $id = 103
            $content = "Here is the text for Local Font"
            $fontFamily = "ShetockFont-ttf"
            $position = (0.1, 0.5)
        }

        ^text = {
            $id = 104
            $content = "Here is the text for Web Font"
            $fontFamily = "LeagueGothic-Italic-otf"
            $position = (0.1, 0.6)
        }

        ^text = {
            $id = 105
            $content = "Here is the text for Google Font"
            $fontFamily = "Staatliches"
            $position = (0.1, 0.7)
        }
    }

    ^slide = {
        $page = 2
        $name = "Image and Graphics Component Testing"
        $last = (10-20)

        ^image = { /* online image */
            $id = 201
            $path = "https://homepages.cae.wisc.edu/~ece533/images/cat.png"
            $position = (100, 200)
        }

        ^image = { /* local image */
            $id = 202
            $path = "./airplane.png"
            $position = (650, 200)
            $width = 733
            $height = 733
        }

        ^graphics = {
            $id = 203
            $type = "circle"
            $width = 200
            $height = 200 /* 300 -> oval */
            $position = (1483, 200)
        }

        ^graphics = {
            $id = 204
            $type = "rectangle"
            $strokeColor = "forestgreen"
            $width = 200
            $height = 500
            $position = (1483, 433)
        }
    }

    ^slide = {
        $page = 3
        $name = "Video Component Testing"
        $last = (20-30)
        ^video = { /* local video */
            $id = 301
            $path = "./sample.mp4"
            $position = (150, 380)
            $height = 480
            $width = 640
        }

        ^video = { /* online video */
            $id = 302
            $path = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            $position = (950, 40)
            $height = 380
            $width = 640
        }

        ^video = { /* YouTube video */
            $id = 303
            $path = "https://www.youtube.com/embed/nWwpyclIEu4"
            $position = (950, 530)
            $height = 400
            $width = 640
        }
    }

    ^slide = {
        $page = 4
        $name = "Quiz and Custom Component Testing"
        $last = (30-40)

        ^quiz = {
            $id = 401
            $questionContent = "Was ist der längster Fluss der Welt?"
            $wrongAnswers = ["Amazonas", "Donau", "Mississippi"]
            $correctAnswer = "Nil"
            $tip = "<br/> - Nil -> 6.671 Km
            <br/> - Amazonas -> 6.400 Km
            <br/> - Donau -> 2.850 Km
            <br/> - Mississippi -> 3.730 Km"
            $position = (100, 180)
        }

        ^custom = {
            $id = 402
            $position = (950, 110)
            $path = "./automaton.html"
        }
    }

    ^slide = {
        $page = 5
        $name = "Animation Testing"
        $last = (40-60)

        ^cursor = {
            $startTime = 40
            $moveTo = (100, 200)
        }

        ^cursor = {
            $startTime = 42
            $moveTo = (600, 200)
        }

        ^cursor = {
            $startTime = 44
            $moveTo = (600, 700)
        }

        ^cursor = {
            $startTime = 46
            $moveTo = (100, 700)
        }

        ^cursor = {
            $startTime = 48
            $moveTo = (100, 200)
        }

        ^image = {
            $id = 501
            $path = "https://homepages.cae.wisc.edu/~ece533/images/boat.png"
            $position = (100, 200)
            $height = 500
            $width = 500

            ^transformation = {
                $startTime = 50
                $type = "scale"
                $toScale = 1.1
            }

            ^transformation = {
                $startTime = 52
                $type = "scale"
                $toScale = 0.8
            }

            ^transformation = {
                $startTime = 54
                $type = "move"
                $toPosition = (800, 200)
            }

            ^transformation = {
                $startTime = 56
                $type = "move"
                $toPosition = (800, 300)
            }

            ^transformation = {
                $startTime = 58
                $type = "move"
                $toPosition = (100, 200)
            }
        }
    }
}
```
###

