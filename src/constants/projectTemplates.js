
/**
 * @todo add more templates!
 */
const projectTemplates = {
    blank:{
        container: {
            height: "10000px",
            width: "10000px"
        },
        nodes: {
            root: {
                children: {
                    "dummy": 1
                }
            }
        }
    },
    classDash:{
        container: {
            height: "10000px",
            width: "10000px"
        },
        nodes : {
            "ClassDashCard1" : {
              "children" : {
                "ClassDashCard2" : 1
              },
              "content" : {
                "displayHeight" : 197,
                "displayWidth" : 350,
                "metadata" : {
                  "author_name" : "3Blue1Brown",
                  "author_url" : "https://www.youtube.com/c/3blue1brown",
                  "height" : 197,
                  "html" : "\n<iframe width=\" 350\" height=\"197\" src=\"https://www.youtube.com/embed/qb40J4N1fa4?feature=oembed\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe>\n",
                  "provider_name" : "YouTube",
                  "provider_url" : "https://www.youtube.com/",
                  "thumbnail_height" : 360,
                  "thumbnail_url" : "https://i.ytimg.com/vi/qb40J4N1fa4/hqdefault.jpg",
                  "thumbnail_width" : 480,
                  "title" : "Implicit differentiation, what's going on here? | Essence of calculus, chapter 6",
                  "type" : "video",
                  "url" : "https://www.youtube.com/watch?v=qb40J4N1fa4",
                  "version" : "1.0",
                  "width" : 350
                },
                "url" : "https://www.youtube.com/watch?v=qb40J4N1fa4&list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr&index=6"
              },
              "parent" : "root",
              "position" : {
                "x" : 893,
                "y" : 44
              },
              "size" : {
                "height" : 237,
                "width" : 370
              },
              "type" : "VideoLink"
            },
            "ClassDashCard3" : {
              "children" : {
                "ClassDashCard4" : 1,
                "ClassDashCard5" : 1,
                "ClassDashCard6" : 1
              },
              "content" : {
                "text" : "<p><strong>Assignments:</strong></p><p><br></p><ol><li>Solve five problems from Calculus, by Gilbert Strang.</li><li>Write essay on the topic, \"Essence of Calculus\".</li><li>Check the deadlines and register for the examination.</li></ol>"
              },
              "parent" : "root",
              "position" : {
                "x" : 97,
                "y" : 20
              },
              "size" : {
                "height" : 200,
                "width" : 280
              },
              "type" : "text"
            },
            "ClassDashCard4" : {
              "content" : {
                "caption" : "Assignment 1",
                "displayHeight" : 400,
                "displayWidth" : 373,
                "height" : 1262,
                "label" : {
                  "description" : "Text White Line Black"
                },
                "metadata" : {
                  "bucket" : "groupthink-fc4b2.appspot.com",
                  "contentDisposition" : "inline; filename*=utf-8''Screen%20Shot%202020-12-15%20at%208.15.50%20PM.png",
                  "contentEncoding" : "identity",
                  "contentType" : "image/png",
                  "customMetadata" : {
                    "JtTSZ6HMPUZN0H6TQVKuYeQvqYN2" : "admin"
                  },
                  "fullPath" : "root/-MOakhGJgSb96yXZ3edt/ClassDashCard4/Screen Shot 2020-12-15 at 8.15.50 PM.png",
                  "generation" : "1608043638153483",
                  "md5Hash" : "zdq86lJ0hSM+xyYZ/44I+g==",
                  "metageneration" : "1",
                  "name" : "Screen Shot 2020-12-15 at 8.15.50 PM.png",
                  "size" : 272420,
                  "timeCreated" : "2020-12-15T14:47:18.153Z",
                  "type" : "file",
                  "updated" : "2020-12-15T14:47:18.153Z"
                },
                "url" : "https://firebasestorage.googleapis.com/v0/b/groupthink-fc4b2.appspot.com/o/root%2F-MOakhGJgSb96yXZ3edt%2FClassDashCard4%2FScreen%20Shot%202020-12-15%20at%208.15.50%20PM.png?alt=media&token=1966ef98-a991-4ddd-a7d2-aa21d534b83d",
                "width" : 1178
              },
              "parent" : "ClassDashCard3",
              "position" : {
                "x" : 519,
                "y" : 302
              },
              "size" : {
                "height" : 460,
                "width" : 393
              },
              "type" : "image"
            },
            "ClassDashCard5" : {
              "children" : {
                "ClassDashCard7" : 1
              },
              "content" : {
                "description" : "[Essence of Calculus|Notes] Introduction——The core idea in calculus, Programmer Sought, the best programmer technical posts sharing site.",
                "domain" : "programmersought.com",
                "img" : "https://programmersought.com/images/620/34771cc635265047cd88593936c31b44.png",
                "title" : "[Essence of Calculus|Notes] Introduction——The core idea in calculus - Programmer Sought",
                "url" : "https://programmersought.com/article/94675408840/"
              },
              "parent" : "ClassDashCard3",
              "position" : {
                "x" : 41,
                "y" : 363
              },
              "size" : {
                "height" : 112,
                "width" : 400
              },
              "type" : "link"
            },
            "ClassDashCard7" : {
              "content" : {
                "text" : "<p><strong>Summary:</strong></p><p><br></p><ol><li>Introduction-The core idea in calculus - Programmer Sought Introduction-The core idea in calculus.</li><li>Viewing the derivation of the circle area formula from the perspective of the infinitesimal method and area approximation.</li><li>If a suitable area calculation formula can be found for each ring, the area of ​​the entire circle can be calculated by summing the areas of all the rings.</li><li>The idea of ​​solving the area under the irregular curve-lead to the basic theorem of calculus.</li><li>As shown in the figure, if you want to request the area under a certain parabola, by moving the boundary line x=k, the area will naturally change.</li><li>Consider the amount of change in the area enclosed by the curve: when I move the straight line to the horizontal axis a little bit to compare the small change in the area.</li><li>Fundamental Theorem of Calculus Description: Through the derivative of the area function under a certain image, the function that defines the image can be restored, which is called \"The basic theorem of calculus\".</li><li><br></li></ol>"
              },
              "parent" : "ClassDashCard5",
              "position" : {
                "x" : 96,
                "y" : 536
              },
              "size" : {
                "height" : 200,
                "width" : 400
              },
              "type" : "text"
            },
            "ClassDashCard2" : {
              "content" : {
                "text" : "<p><strong>Video Script:</strong></p><p><br></p><p>Let me share with you something I found particularly weird when I was a student first learning calculus. Let’s say you have a circle with radius 5 centered at the origin of the xy-coordinate plane, which is defined using the equation x^2 + y^2 = 5^2. That is, all points on this circle are a distance 5 from the origin, as encapsulated by the pythagorean theorem with the sum of the squares of the legs of this triangle equalling the square of the hypotenuse, 52. And suppose you want to find the slope of a tangent line to this circle, maybe at the point (x, y) = (3, 4). Now, if you’re savvy with geometry, you might already know that this tangent line is perpendicular to the radius line touching that point. But let’s say you don’t already know that, or that you want a technique that generalizes to curves other than circles. As with other problems about slope of tangent lines, they key thought here is to zoom in close enough that the curve basically looks just like its own tangent line, then ask about a tiny step along that curve. The y-component of that little step is what you might call dy, and the x-component is a little dx, so the slope we’re looking for is the rise over run dy/dx. But unlike other tangent-slope problems in calculus, this curve is not the graph of a function, so we cannot take a simple derivative, asking about the size of a tiny nudge to the output of a function caused by some tiny nudge to the input. x is not an input and y is not an output in this case, they’re both just interdependent values related by some equation. This is called an “implicit curve”; it’s just the set of all points (x, y) that satisfy some property written in terms of the two variables x and y. The procedure for finding dy/dx here is what I found very weird as a calculus student, you take the derivative of both sides of this equation like this: For the derivative of x2 you write 2x*dx, similarly y2 becomes 2y*dy, and the derivative of the constant 52 on the right is 0. You can see why this feels strange, right? What does it mean to take a derivative of an expression with multiple variables? And why are we tacking on the little dy and dx in this way? But if you just blindly move forward with what you get here, you can rearrange to find an expression for dy/dx, which in this case comes out to -x/y. So at a point with coordinates (x, y) = (3, 4), that slope would be -¾, evidently. This strange process is called “implicit differentiation”. Don’t worry, I have an explanation for how you can interpret taking a derivative of an expression with two variables like this. But first, I want to set aside this particular problem, and show how this is related to a different type of calculus problem: Related rates. Imagine a 5 meter long ladder up against a wall, where the top of the ladder starts of 4 meters above the ground, which, by the pythagorean theorem, means the bottom is 3 meters away from the wall. And say it’s slipping down the wall in such a way that the top of the ladder is dropping at 1 meter per second. The question is, in that initial moment, what is the rate at which the bottom of the ladder is moving away from the wall. It’s interesting, right? That distance from the bottom of the ladder to the wall is 100% determined by the distance between the top of the ladder and the floor, so we should have enough information to figure out how the rates of change for each value depend on each other, but it might not be entirely clear at first how to relate the two. First thing’s first, it’s always nice to give names to the quantities we care about. So label the distance from the top of the ladder to the ground y(t), written as a function of time because it’s changing. Likewise, label the distance between the bottom of the ladder and the wall x(t). They key equation here that relates these terms is the pythagorean theorem: x(t)2 + y(t)2 = 52. What makes this equation powerful is that it’s true at all points in time. One way to solve this would be to isolate x(t), figure out what what y(t) must be based this 1 meter/second drop rate, then take a derivative of the resulting function; dx/dt, the rate at which x is changing with respect to time. And that’s fine; it involves a couple layers of using the chain rule, and it will definitely work for you. But I want to show a different way to think about the same thing. This left-hand side of the equation is a function of time, right? It just so happens to equal a constant, meaning this value evidently doesn’t change while time passes, but it’s still written as an expression dependent on time which we can manipulate like any other function with t as an input. In particular, we can take a derivative of the left hand side, which is a way of saying “If I let a little bit of time pass, dt, which causes y to slightly decrease, and x to slightly increase, how much does this expression change”. On the one hand, we know that derivative should be 0, since this expression equals a constant, and constants don’t care about your tiny nudge to time, they remain unchanged. But on the other hand, what do you get by computing the derivative of this left-hand-side? The derivative of x(t)2 is 2*x(t)*(the derivative of x). That’s the chain rule I talked about last video. 2x*dx represents the size of a change to x2 caused by a change to x, and we’re dividing by dt. Likewise, the rate at which y(t)2 is changing is 2*y(t)*(the derivative of y). Evidently, this whole expression must be zero, which is equivalent to saying x2+y2 doesn’t change while the ladder moves. And at the very start, t=0, the height y(t) is 4 meters, the distance x(t) is 3 meters, and since the top of the ladder is dropping at a rate of 1 meter per second, that derivative dy/dt is -1 meters/second. Now this gives us enough information to isolate the derivative dx/dt, which, when you work it out, is (4/3) meters per second. Now compare this to the problem of finding the slope of tangent line to the circle. In both cases, we had the equation x2 + y2 = 52, and in both cases we ended up taking the derivative of each side of this expression. But for the ladder problem, these expressions were functions of time, so taking the derivative has a clear meaning: it’s the rate at which this expression changes as time change. But what makes the circle situation strange is that rather than saying a small amount of time dt has passed, which causes x and y to change, the derivative has the tiny nudges dx and dy both just floating free, not tied to some other common variable like time. Let me show you how you can think about this: Give this expression x2 + y2 a name, maybe S. S is essentially a function of two variables, it takes every point (x, y) on the plane and associates it with a number. For points on this circle, that number is 25. If you step off that circle away from the center, that value would be bigger. For other points (x, y) closer to the origin, that value is smaller. What it means to take a derivative of this expression, a derivative of S, is to consider a tiny change to both these variables, some tiny change dx to x, and some tiny change dy to y –and not necessarily one that keeps you on this circle, by the way, it’s just some tiny step in any direction on the xy-plane– and ask how much the value of S changes. That difference in the value of S, from the original point to the nudged point, is what I’m writing as “dS”. For example, in this picture we’re starting at a point where x is 3 and y is 4, and let’s just say that step dx is... -0.02, and that dy is -0.01. Then the decrease to S, the amount the x2+y2 changes over that step, will be around 2(3)(-0.02) + 2(4)(-0.01). That’s what this derivative expression 2x*dx + 2y*dy means, it tells you how much the value x2+y2 changes, as determined by the point (x, y) where you started, and the tiny step (dx, dy) that you take. As with all things derivative, this is only an approximation, but it gets more and more true for smaller and smaller choices of dx and dy. The key point is that when you restrict yourself to steps along this circle, you’re essentially saying you want to ensure that this value S doesn’t change; it starts at a value of 25, and you want to keep it at a value of 25; that is, dS should be 0. So setting this expression 2x*dx + 2y*dy equal to 0 is the condition under which a tiny step stays on the circle. Again, this is only an approximation. Speaking more precisely, that condition keeps you on a tangent line of the circle, not the circle itself, but for tiny enough steps those are essentially the same thing. Of course, there’s nothing special about the expression x2+y2 = 52 here. You could have some other expression involving x’s and y’s, representing some other curve, and taking the derivative of both sides like this would give you a way to relate dx to dy for tiny steps along that curve. It’s always nice to think through more examples, so consider the expression sin(x)*y2 = x, which corresponds to many U-shaped curves on the plane. Those curves represent all the points (x, y) of the plane where the value of sin(x)*y2 equals the value of x. Now imagine taking some tiny step with components (dx, dy), and not necessarily one that keeps you on the curve. Taking the derivative of each side of this equation will tell us how much the value of that side changes during this step. On the left side, the product rule that we found in the last video tells us that this should be “left d-right plus right d-left”: sin(x)*(the change to y2), which is 2y*dy, plus y2*(the change to sin(x)), which is cos(x)*dx. The right side is simply x, so the size of a change to the value is exactly dx, right? Setting these two sides equal to each other is a way of saying “whatever your tiny step with coordinates (dx, dy) is, if it’s going to keep us on this curve, the values of both the left-hand side and the right-hand side must change by the same amount.” That’s the only way this top equation can remain true. From there, depending on what problem you’re solving, you could manipulate further with algebra, where perhaps the most common goal is to find dy divided by dx. As one more example, let me show how you can use this technique to help find new derivative formulas. I’ve mentioned in a footnote video that the derivative of ex is itself, but what about the derivative of its inverse function the natural log of x? The graph of ln(x) can be thought of as an implicit curve; all the points on the xy plane where y = ln(x), it just happens to be the case that the x’s and y’s of this equation aren’t as intermingled as they were in other examples. The slope of this graph, dy/dx, should be the derivative of ln(x), right? Well, to find that, first rearrange this equation y = ln(x) to be ey = x. This is exactly what the natural log of x means; it’s saying e to the what equals x. Since we know the derivative of ey, we can take the derivative of both sides, effectively asking how a tiny step with components (dx, dy) changes the value of each side. To ensure the step stays on the curve, the change to the left side of the equation, which is ey*dy, must equals the change to the right side, which is dx. Rearranging, this means dy/dx, the slope of our graph, equals 1/ey. And when we’re on this curve, ey is by definition the same as x, so evidently the slope is 1/x. An expression for the slope of the graph of function in terms of x like this is the derivative of that function, so evidently the derivative of ln(x) is 1/x. By the way, all of this is a little peek into multivariable calculus, where you consider functions with multiple inputs, and how they change as you tweak those inputs. The key, as always, is to have a clear image in your head of what tiny nudges are at play, and how exactly they depend on each other. Next up, I’ll talk about about what exactly a limit is, and how it’s used to formalize the idea of a derivative.</p>"
              },
              "parent" : "ClassDashCard1",
              "position" : {
                "x" : 963,
                "y" : 371
              },
              "size" : {
                "height" : 200,
                "width" : 400
              },
              "type" : "text"
            },
            "ClassDashCard6" : {
              "content" : {
                "description" : "The CLEP Calculus exam covers skills and concepts that are usually taught in a one-semester college course in calculus.",
                "domain" : "clep.collegeboard.org",
                "img" : "https://clep.collegeboard.org/sites/default/files/2021-clep-official-study-guide.jpg",
                "title" : "Calculus Exam – CLEP – The College Board",
                "url" : "https://clep.collegeboard.org/science-and-mathematics/calculus"
              },
              "editing" : {
                "JtTSZ6HMPUZN0H6TQVKuYeQvqYN2" : 1608044212552
              },
              "parent" : "ClassDashCard3",
              "position" : {
                "x" : 442,
                "y" : 81
              },
              "size" : {
                "height" : 112,
                "width" : 400
              },
              "type" : "link"
            },
            "root" : {
              "children" : {
                "ClassDashCard1" : 1,
                "ClassDashCard3" : 1,
                "dummy" : 1
              }
            }
          },
    }
}
export default projectTemplates;

    
