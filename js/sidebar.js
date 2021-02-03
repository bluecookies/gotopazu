
var sidebar = $("<div>", { "class": "sidebar" });

sidebar
	.append($("<div>").append( $("<a>", { href: "/" }).append("Main") ))
	.append($("<div>").append( $("<a>", { href: "/cards.html" }).append("Cards") ))
	.append($("<div>").append( $("<a>", { href: "/homework.html" }).append("Homework") ))

$("body").prepend(sidebar);

