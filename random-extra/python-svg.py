import random
import math

def main():
    with open("./svg-text.html", "r") as html:
        html_text = html.read()
    
    start_sep = "<!-- Put it here -->"
    end_sep = "<!-- End it here -->"
    pre_html = html_text.split(start_sep)[0]
    post_html = html_text.split(end_sep)[-1]

    # Now add all of the stuff
    size = 2
    stroke_width = size*(2)
    svg_style = f"border: 1px solid black; stroke:#000; stroke-width:{stroke_width};"

    svg1 = Svg(int(300*size), int(100*size * 2), style=svg_style)
    for i in range(100):
        gap = size*3.1
        # line = Line(10, 10 + gap*i, 50 + random.randint(0, size*20), 10 + gap*i)
        line   = Line(10, 10 + gap*i, 60 + 10*math.sin(i) + i*i / 10, 10 + gap*i)
        gray_amount = i*3 + random.randint(0, 40)
        line.style = f"stroke=\"#{gray_amount:2x}{gray_amount:2x}{gray_amount:2x}\" "
        line.line = line.insert_string(line.line, line.style)
        svg1.lines.insert(-1, line.build_final())
    # line1 = Line(10, 10, 50, 10)
    # svg1.lines.insert(-1, line1.build_final())


    new_stuff = svg1.build_final()
    print(new_stuff)
    html_out = pre_html + start_sep + "\n" + new_stuff + end_sep + post_html
    
    with open("./svg-python-out.html", "w") as out:
        out.write(html_out)

class Svg:
    def __init__(self, width=100, height=100, style=None):
        self.width = width
        self.height = height
        self.style = style
        self.line = None
        self.end = "</svg>"
        self.attrs = {"width": self.width,
                      "height": self.height,
                      "style": self.style}
        self.lines = ['<svg>',
                      self.end]
        self.lines[0] = self.insert_string(self.lines[0], self.build_attr())

    def insert_string(self, line: str, string: str, before=">"):
        line_sections = line.split(before)
        return line[:len(line_sections[0])] + " " + string + line[len(line_sections[0]):]
    
    def build_attr(self, attrs:dict=None):
        if not attrs:
            attrs = self.attrs
        attr_str = ""
        for item in attrs.keys():
            if attrs[item]:
                attr_str += f"{item}=\"{attrs[item]}\"" + " "
        return attr_str
    
    def build_final(self):
        if not self.lines:
            return self.line + self.end
        final_str = ""
        for line in self.lines:
            final_str += line + '\n'
        return final_str

class Line(Svg):
    def __init__(self, x1=5, y1=5, x2=20, y2=5):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.line = "<line>"
        self.end = "</line>"
        self.lines = None
        self.line = self.insert_string(self.line, f'x1="{self.x1}" y1="{self.y1}" x2="{self.x2}" y2="{self.y2}"')

    def build_final(self):
        return super().build_final()

if __name__ == '__main__':
    main()